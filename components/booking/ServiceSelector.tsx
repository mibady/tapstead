import React from 'react';
import { Service } from '@/lib/booking/services';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MessageSquare, Check, Clock } from 'lucide-react';

interface ServiceSelectorProps {
  services: Service[];
  onSelect: (service: Service) => void;
}

export default function ServiceSelector({ services, onSelect }: ServiceSelectorProps) {
  const instantBookingServices = services.filter(s => s.bookingType === 'instant');
  const quoteServices = services.filter(s => s.bookingType === 'quote');

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Book Your Service</h1>
        <p className="text-lg text-gray-600">Choose how you'd like to get started</p>
      </div>

      {/* Instant Booking Section */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="h-6 w-6 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-900">Book Online Now</h2>
          <Badge className="bg-green-100 text-green-800">Instant Booking</Badge>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {instantBookingServices.map(service => (
            <Card key={service.id} className="hover:shadow-lg transition-all duration-200 border-2 border-green-100 hover:border-green-300">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl text-gray-900">{service.name}</CardTitle>
                    <CardDescription className="text-gray-600 mt-2">{service.description}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      ${service.rate?.min}-${service.rate?.max}
                    </div>
                    <div className="text-sm text-gray-500">{service.rate?.unit.replace('_', ' ')}</div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{service.estimatedDuration}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {service.features?.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  onClick={() => onSelect(service)} 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                >
                  Book Now - Pay Online
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quote Request Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Request a Free Quote</h2>
          <Badge className="bg-blue-100 text-blue-800">On-site Assessment</Badge>
        </div>
        
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-blue-800 text-sm">
            <strong>Why on-site quotes?</strong> These services require assessment of your specific needs, 
            property conditions, and project scope to provide accurate pricing. Our experts will visit 
            your home for a free consultation and detailed estimate.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quoteServices.map(service => (
            <Card key={service.id} className="hover:shadow-lg transition-all duration-200 border-2 border-blue-100 hover:border-blue-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-gray-900">{service.name}</CardTitle>
                <CardDescription className="text-gray-600">{service.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-2 mb-6">
                  {service.features?.slice(0, 3).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  onClick={() => onSelect(service)} 
                  variant="outline"
                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  Get Free Quote
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
