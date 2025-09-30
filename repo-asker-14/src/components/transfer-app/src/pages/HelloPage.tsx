
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Sparkles } from 'lucide-react';

const HelloPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Sparkles className="h-12 w-12 text-purple-500 animate-pulse" />
              <Heart className="h-6 w-6 text-red-500 absolute -top-1 -right-1" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-800">
            Hello! 👋
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 mt-2">
            Welcome to your new page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            This is your brand new hello page! You can customize it however you'd like.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button 
              variant="default" 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => console.log('Hello clicked!')}
            >
              Say Hello Back
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelloPage;
