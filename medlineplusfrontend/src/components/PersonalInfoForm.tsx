'use client'

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiService } from '@/services/api';
import { Button } from './ui/button';
import { Select } from './ui/select';
import { Input } from './ui/input';
import { Card } from './ui/card';

export function PersonalInfoForm() {
  const { user } = useAuth();
  const { currentLanguage } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    age_range: '',
    gender: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      await apiService.createPersonalInfo({
        user_id: user.id,
        ...formData,
        language: currentLanguage
      });
      
      // Handle successful submission (e.g., redirect or show success message)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="age_range">Age Range</label>
          <Select
            id="age_range"
            value={formData.age_range}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              age_range: e.target.value
            }))}
          >
            <option value="">Select age range</option>
            <option value="18-24">18-24</option>
            <option value="25-34">25-34</option>
            <option value="35-44">35-44</option>
            <option value="45-54">45-54</option>
            <option value="55-64">55-64</option>
            <option value="65+">65+</option>
          </Select>
        </div>

        <div>
          <label htmlFor="gender">Gender</label>
          <Select
            id="gender"
            value={formData.gender}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              gender: e.target.value
            }))}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </Select>
        </div>

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}

        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Saving...' : 'Save Information'}
        </Button>
      </form>
    </Card>
  );
}