import React, { createContext, useContext, useState } from 'react'

export type SurveyData = {
  personalInfo: {
    ageRange: string
    gender: string
    language: 'English' | 'Spanish'
  }
  medicalHistory: {
    conditions: Array<{
      name: string
      name_es?: string
      concept_id: string
      semantic_type: string
      sources: string
    }>
  }
}

export type SurveyContextType = {
  surveyData: SurveyData
  updateSurveyData: (data: Partial<SurveyData>) => void
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined)

export const useSurveyContext = () => {
  const context = useContext(SurveyContext)
  if (!context) {
    throw new Error('useSurveyContext must be used within a SurveyProvider')
  }
  return context
}

export const SurveyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [surveyData, setSurveyData] = useState<SurveyData>({
    personalInfo: { 
      ageRange: '', 
      gender: '', 
      language: 'English' 
    },
    medicalHistory: { 
      conditions: []
    }
  })

  const updateSurveyData = (data: Partial<SurveyData>) => {
    setSurveyData(prev => ({
      ...prev,
      ...data
    }))
  }

  return (
    <SurveyContext.Provider value={{ surveyData, updateSurveyData }}>
      {children}
    </SurveyContext.Provider>
  )
} 