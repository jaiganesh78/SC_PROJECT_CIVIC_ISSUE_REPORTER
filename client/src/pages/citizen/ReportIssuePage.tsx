import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { LocationPicker } from '@/components/map/LocationPicker';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCreateIssue } from '@/hooks/useCreateIssue';
import { 
  Camera, 
  MapPin, 
  Upload, 
  Loader2, 
  AlertCircle, 
  CheckCircle2,
  X,
  Navigation,
  Map as MapIcon
} from 'lucide-react';
import { GeoLocation } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function ReportIssuePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createIssueMutation = useCreateIssue();
  
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // Auto-detect location on mount
  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = () => {
    setIsLocating(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Try to reverse geocode for place name
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' } }
          );
          
          if (response.ok) {
            const data = await response.json();
            setLocation({
              latitude,
              longitude,
              place: data.display_name || 'Detected Location',
            });
          } else {
            setLocation({
              latitude,
              longitude,
              place: 'Detected Location',
            });
          }
        } catch {
          setLocation({
            latitude,
            longitude,
            place: 'Detected Location',
          });
        }
        
        setIsLocating(false);
      },
      (error) => {
        setLocationError('Failed to detect location. Please enable GPS or select manually on map.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please select an image under 10MB',
          variant: 'destructive',
        });
        return;
      }
      
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLocationPickerSelect = (selectedLocation: GeoLocation) => {
    setLocation(selectedLocation);
    setLocationError('');
    setShowLocationPicker(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!image) {
      toast({
        title: 'Image required',
        description: 'Please upload a photo of the issue',
        variant: 'destructive',
      });
      return;
    }

    if (!location) {
      toast({
        title: 'Location required',
        description: 'Please detect or select a location',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

try {
  const result = await createIssueMutation.mutateAsync({
    description,
    latitude: location.latitude,
    longitude: location.longitude,
    image,
  });

  // Duplicate detection
  if (result.duplicateDetected) {
    toast({
      title: 'Similar issue already reported',
      description: 'You can upvote the existing issue instead.',
    });

    console.log("Duplicates:", result.duplicates);

    setIsSubmitting(false);
    return;
  }

  toast({
    title: 'Issue reported successfully!',
    description: 'AI is analyzing your report. You will receive updates soon.',
  });

  navigate('/my-issues');

} catch (error) {

  toast({
    title: 'Failed to submit',
    description: 'Please try again later',
    variant: 'destructive',
  });

} finally {
  setIsSubmitting(false);
}
  };

  // Show full-screen location picker when active
  if (showLocationPicker) {
    return (
      <LocationPicker
        onLocationSelect={handleLocationPickerSelect}
        onCancel={() => setShowLocationPicker(false)}
        initialLocation={location || undefined}
      />
    );
  }

  return (
    <MainLayout requireAuth allowedRoles={['citizen']}>
      <div className="container max-w-2xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Report an Issue</h1>
          <p className="mt-2 text-muted-foreground">
            Help improve your community by reporting civic issues
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Issue Details</CardTitle>
            <CardDescription>
              Upload a photo and we'll automatically detect the issue type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Photo of Issue *</Label>
                <div 
                  className={`relative rounded-lg border-2 border-dashed transition-colors ${
                    imagePreview 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-64 w-full rounded-lg object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-2 top-2 h-8 w-8"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="flex cursor-pointer flex-col items-center justify-center py-12"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Camera className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-sm font-medium">Click to upload a photo</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add any additional details about the issue..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  AI will generate a summary based on the image
                </p>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label>Location *</Label>
                {locationError && (
                  <Alert variant="destructive" className="mb-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{locationError}</AlertDescription>
                  </Alert>
                )}
                
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  {isLocating ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <span className="text-sm">Detecting your location...</span>
                    </div>
                  ) : location ? (
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <MapPin className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Selected Location</p>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {location.place}
                            </p>
                          </div>
                        </div>
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                      </div>
                      
                      {/* Location selection buttons */}
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={detectLocation}
                        >
                          <Navigation className="mr-2 h-4 w-4" />
                          Re-detect Location
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowLocationPicker(true)}
                        >
                          <MapIcon className="mr-2 h-4 w-4" />
                          Select on Map
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground text-center mb-3">
                        Choose how to set the issue location
                      </p>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={detectLocation}
                          className="flex-1"
                        >
                          <Navigation className="mr-2 h-4 w-4" />
                          Detect Current Location
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowLocationPicker(true)}
                          className="flex-1"
                        >
                          <MapIcon className="mr-2 h-4 w-4" />
                          Select Location on Map
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Info box */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Our AI will automatically detect the issue category and priority 
                  based on your photo. You'll receive SMS updates on the status.
                </AlertDescription>
              </Alert>

              {/* Submit button */}
              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isSubmitting || createIssueMutation.isPending || !image || !location}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-5 w-5" />
                    Submit Report
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
