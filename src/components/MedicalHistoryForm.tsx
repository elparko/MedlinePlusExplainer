import { useForm, FieldValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from './ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { useState, MouseEvent, KeyboardEvent, ChangeEvent, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from './ui/card'
import debounce from 'lodash/debounce'
import { NavigationArrows } from "@/components/ui/navigation-arrows"

interface Disease {
  name: string;
  name_es?: string;
  concept_id: string;
  semantic_type: string;
  sources: string;
  distance?: number;
}

interface SupabaseResult {
  topic_id: string;
  title: string;
  title_es?: string;
}

const STANDARD_CONDITIONS = {
  'Heart': {
    name_es: 'Corazón',
    conditions: [
      {
        name: "High Blood Pressure",
        name_es: "Presión Arterial Alta",
        concept_id: "HP001",
        semantic_type: "MedlinePlus Topic",
        sources: "MedlinePlus"
      },
      {
        name: "Heart Disease",
        name_es: "Enfermedad Cardíaca",
        concept_id: "HD001",
        semantic_type: "MedlinePlus Topic",
        sources: "MedlinePlus"
      },
      {
        name: "High Cholesterol",
        name_es: "Colesterol Alto",
        concept_id: "HC001",
        semantic_type: "MedlinePlus Topic",
        sources: "MedlinePlus"
      }
    ]
  },
  'Metabolic': {
    name_es: 'Metabólico',
    conditions: [
      {
        name: "Diabetes",
        name_es: "Diabetes",
        concept_id: "DB001",
        semantic_type: "MedlinePlus Topic",
        sources: "MedlinePlus"
      },
      {
        name: "Thyroid Problems",
        name_es: "Problemas de Tiroides",
        concept_id: "TH001",
        semantic_type: "MedlinePlus Topic",
        sources: "MedlinePlus"
      },
      {
        name: "Obesity",
        name_es: "Obesidad",
        concept_id: "OB001",
        semantic_type: "MedlinePlus Topic",
        sources: "MedlinePlus"
      }
    ]
  },
  'Respiratory': {
    name_es: 'Respiratorio',
    conditions: [
      {
        name: "Asthma",
        name_es: "Asma",
        concept_id: "AS001",
        semantic_type: "MedlinePlus Topic",
        sources: "MedlinePlus"
      },
      {
        name: "COPD",
        name_es: "EPOC",
        concept_id: "CP001",
        semantic_type: "MedlinePlus Topic",
        sources: "MedlinePlus"
      },
      {
        name: "Sleep Apnea",
        name_es: "Apnea del Sueño",
        concept_id: "SA001",
        semantic_type: "MedlinePlus Topic",
        sources: "MedlinePlus"
      }
    ]
  },
  'Musculoskeletal': {
    name_es: 'Musculoesquelético',
    conditions: [
      {
        name: "Arthritis",
        name_es: "Artritis",
        concept_id: "AR001",
        semantic_type: "MedlinePlus Topic",
        sources: "MedlinePlus"
      },
      {
        name: "Osteoporosis",
        name_es: "Osteoporosis",
        concept_id: "OS001",
        semantic_type: "MedlinePlus Topic",
        sources: "MedlinePlus"
      },
      {
        name: "Back Pain",
        name_es: "Dolor de Espalda",
        concept_id: "BP001",
        semantic_type: "MedlinePlus Topic",
        sources: "MedlinePlus"
      }
    ]
  },
  'Mental Health': {
    name_es: 'Salud Mental',
    conditions: [
      {
        name: "Depression",
        name_es: "Depresión",
        concept_id: "DP001",
        semantic_type: "MedlinePlus Topic",
        sources: "MedlinePlus"
      },
      {
        name: "Anxiety",
        name_es: "Ansiedad",
        concept_id: "AX001",
        semantic_type: "MedlinePlus Topic",
        sources: "MedlinePlus"
      },
      {
        name: "PTSD",
        name_es: "Trastorno de Estrés Postraumático",
        concept_id: "PT001",
        semantic_type: "MedlinePlus Topic",
        sources: "MedlinePlus"
      }
    ]
  }
} as const;

const formSchema = z.object({
  conditions: z.array(
    z.object({
      name: z.string(),
      concept_id: z.string(),
      semantic_type: z.string(),
      sources: z.string(),
    })
  ).default([]),
  searchCondition: z.string().optional(),
})

export type MedicalHistoryData = z.infer<typeof formSchema>

interface MedicalHistoryFormProps {
  onNext: (data: MedicalHistoryData) => void | Promise<void>
  onPrevious: () => void
  initialData?: MedicalHistoryData | null
  language?: string
}

export function MedicalHistoryForm({ onNext, onPrevious, initialData, language = 'English' }: MedicalHistoryFormProps) {
  console.log('MedicalHistoryForm language:', language);
  
  const [suggestions, setSuggestions] = useState<Disease[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  
  const form = useForm<MedicalHistoryData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      conditions: initialData?.conditions || [],
      searchCondition: '',
    },
  })

  const searchConditions = async (term: string) => {
    if (!term) {
      setSuggestions([])
      return
    }

    console.log('Searching with language:', language);
    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:8000/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: term,
          n_results: 5,
          language: language
        }),
      })
      
      const data = await response.json()
      console.log('Search response:', data);
      
      if (!response.ok) throw new Error('Failed to fetch suggestions')
      
      if (data.results && Array.isArray(data.results)) {
        const diseases: Disease[] = data.results.map((result: SupabaseResult) => ({
          name: result.title,
          name_es: result.title_es || result.title,
          concept_id: result.topic_id,
          semantic_type: 'MedlinePlus Topic',
          sources: 'MedlinePlus'
        }))
        
        setSuggestions(diseases)
      } else {
        console.error('Unexpected response format:', data)
        setSuggestions([])
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    if (value.length >= 2) {
      searchConditions(value)
    } else {
      setSuggestions([])
    }
  }

  const addCondition = (disease: Disease) => {
    const currentConditions = form.getValues('conditions')
    const newCondition = {
      name: disease.name,
      concept_id: disease.concept_id,
      semantic_type: disease.semantic_type,
      sources: disease.sources,
    }
    
    if (!currentConditions.some(c => c.concept_id === disease.concept_id)) {
      form.setValue('conditions', [...currentConditions, newCondition])
    }
    
    setSearchTerm('')
    setSuggestions([])
  }

  const removeCondition = (conceptId: string) => {
    const currentConditions = form.getValues('conditions')
    form.setValue(
      'conditions',
      currentConditions.filter(c => c.concept_id !== conceptId)
    )
  }

  function onSubmit(values: MedicalHistoryData) {
    onNext(values)
  }

  const getLocalizedName = (condition: Disease) => {
    return language === 'Spanish' ? (condition.name_es || condition.name) : condition.name
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <div className="space-y-6 mb-8">
              <FormLabel>{language === 'Spanish' ? 'Condiciones Médicas Comunes' : 'Common Medical Conditions'}</FormLabel>
              <div className="space-y-6">
                {Object.entries(STANDARD_CONDITIONS).map(([category, { name_es, conditions }]) => (
                  <div key={category} className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      {language === 'Spanish' ? name_es : category}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {conditions.map((condition) => (
                        <Button
                          key={condition.concept_id}
                          type="button"
                          variant="outline"
                          className="justify-start h-auto min-h-[44px] py-2 px-3 whitespace-normal text-left"
                          onClick={() => addCondition(condition)}
                          disabled={form.getValues('conditions').some(
                            c => c.concept_id === condition.concept_id
                          )}
                        >
                          <span className="text-sm line-clamp-2">{getLocalizedName(condition)}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <FormLabel>
                {language === 'Spanish' ? 'Buscar y Agregar Condiciones Médicas' : 'Search and Add Medical Conditions'}
              </FormLabel>
              <Input
                type="text"
                placeholder={language === 'Spanish' ? 'Escriba para buscar condiciones...' : 'Type to search conditions...'}
                value={searchTerm}
                onChange={handleSearchChange}
              />
              
              {isLoading && <div>{language === 'Spanish' ? 'Cargando...' : 'Loading...'}</div>}
              
              {suggestions.length > 0 && (
                <Card>
                  <CardContent className="p-2">
                    {suggestions.map((disease) => (
                      <button
                        key={disease.concept_id}
                        type="button"
                        className="w-full text-left p-2 hover:bg-accent rounded-md whitespace-normal min-h-[40px]"
                        onClick={() => addCondition(disease)}
                      >
                        <span className="text-sm line-clamp-2">{getLocalizedName(disease)}</span>
                      </button>
                    ))}
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                {form.getValues('conditions').map((condition) => (
                  <div
                    key={condition.concept_id}
                    className="flex items-start justify-between p-2 bg-accent/50 rounded-md gap-2"
                  >
                    <span className="text-sm leading-tight py-1">{getLocalizedName(condition)}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="shrink-0"
                      onClick={() => removeCondition(condition.concept_id)}
                    >
                      {language === 'Spanish' ? 'Eliminar' : 'Remove'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <NavigationArrows 
            onNext={form.handleSubmit(onSubmit)} 
            onPrevious={onPrevious}
            showPrevious={true}
          />
        </form>
      </Form>
    </div>
  )
}

