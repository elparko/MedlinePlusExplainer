import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { PersonalInfoForm, PersonalInfoData } from "../components/PersonalInfoForm"
import { MedicalHistoryForm, MedicalHistoryData } from "../components/MedicalHistoryForm"
import { BackArrow } from "../components/ui/back-arrow"
import { useAuth } from "../providers/AuthProvider"
import { useNavigate } from "react-router-dom"

export function Survey() {
  const [step, setStep] = useState(0)
  const { updateSurveyData, surveyData } = useAuth()
  const navigate = useNavigate()
  const [localLanguage, setLocalLanguage] = useState<string>('English')

  useEffect(() => {
    if (surveyData?.personalInfo?.language) {
      setLocalLanguage(surveyData.personalInfo.language)
    }
  }, [surveyData])

  const handlePersonalInfoSubmit = async (data: PersonalInfoData) => {
    console.log('PersonalInfo submitted:', data);
    
    const language = data.language === 'Spanish' ? 'Spanish' : 'English';
    setLocalLanguage(language);  // Set local state immediately
    
    try {
      await updateSurveyData({
        ...surveyData,
        personalInfo: {
          ...data,
          language: language
        }
      })
      setStep(1)
    } catch (error) {
      console.error('Error updating survey data:', error);
    }
  }

  const handleMedicalHistorySubmit = async (data: MedicalHistoryData) => {
    await updateSurveyData({
      ...surveyData,
      medicalHistory: data
    })
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="relative h-16 border-b">
        <BackArrow />
      </header>
      <div className="p-8">
        <div className="flex justify-center w-full">
          <Card className="mb-8 max-w-2xl w-full">
            <CardHeader>
              <CardTitle>
                {step === 0 && "Personal Information"}
                {step === 1 && "Medical History"}
              </CardTitle>
              <CardDescription>
                Step {step + 1} of 2
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === 0 && <PersonalInfoForm onNext={handlePersonalInfoSubmit} initialData={surveyData?.personalInfo} />}
              {step === 1 && <MedicalHistoryForm onNext={handleMedicalHistorySubmit} onPrevious={() => setStep(0)} initialData={surveyData?.medicalHistory} language={localLanguage} />}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 