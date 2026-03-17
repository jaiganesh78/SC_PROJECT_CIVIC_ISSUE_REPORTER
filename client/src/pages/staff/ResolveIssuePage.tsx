import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { IssueDetailView } from '@/components/issues/IssueDetailView';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Camera, 
  Upload, 
  Loader2, 
  X, 
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { demoIssues } from '@/data/demoIssues';
import { useToast } from '@/hooks/use-toast';

export default function ResolveIssuePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const issue = demoIssues.find(i => i.id === id);

  const [proofImage, setProofImage] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [flagAsFake, setFlagAsFake] = useState(false);
  const [fakeReason, setFakeReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!issue) {
    return (
      <MainLayout requireAuth allowedRoles={['department_staff']}>
        <div className="flex items-center justify-center p-12">
          <Card>
            <CardContent className="py-8 text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
              <h2 className="mt-4 text-lg font-semibold">Issue not found</h2>
              <Button className="mt-4" onClick={() => navigate('/staff/assigned')}>
                Back to assigned issues
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

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

      setProofImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProofImage(null);
    setProofPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!proofImage) {
      toast({
        title: 'Proof required',
        description: 'Please upload a proof image of the resolution',
        variant: 'destructive',
      });
      return;
    }

    if (flagAsFake && !fakeReason.trim()) {
      toast({
        title: 'Reason required',
        description: 'Please provide a reason for flagging as fake',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: flagAsFake ? 'Issue flagged and resolved' : 'Issue resolved successfully',
        description: 'The admin will verify the resolution.',
      });

      navigate('/staff/assigned');
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

  const isResolved = ['resolved', 'verified'].includes(issue.status);

  return (
    <MainLayout requireAuth allowedRoles={['department_staff']}>
      <div className="p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          {/* Issue details */}
          <div className="mb-8">
            <IssueDetailView issue={issue} showVoteButton={false} showActions={false} />
          </div>

          {/* Resolution form */}
          {!isResolved ? (
            <Card>
              <CardHeader>
                <CardTitle>Submit Resolution</CardTitle>
                <CardDescription>
                  Upload proof of resolution and add any relevant notes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Proof image upload */}
                  <div className="space-y-2">
                    <Label>Proof Image *</Label>
                    <div
                      className={`relative rounded-lg border-2 border-dashed transition-colors ${
                        proofPreview
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {proofPreview ? (
                        <div className="relative">
                          <img
                            src={proofPreview}
                            alt="Proof preview"
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
                          <p className="text-sm font-medium">Upload proof of resolution</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Take a photo showing the issue has been fixed
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

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Resolution Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Describe what was done to resolve the issue..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Flag as fake */}
                  <div className="rounded-lg border border-border p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="flagFake"
                        checked={flagAsFake}
                        onCheckedChange={(checked) => setFlagAsFake(!!checked)}
                      />
                      <div className="flex-1">
                        <label
                          htmlFor="flagFake"
                          className="text-sm font-medium cursor-pointer"
                        >
                          Flag as potentially fake report
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Select if you believe this issue was not genuine
                        </p>
                      </div>
                    </div>

                    {flagAsFake && (
                      <div className="mt-4 space-y-2">
                        <Label htmlFor="fakeReason">Reason for flagging *</Label>
                        <Textarea
                          id="fakeReason"
                          placeholder="Explain why you believe this is a fake report..."
                          value={fakeReason}
                          onChange={(e) => setFakeReason(e.target.value)}
                          rows={2}
                        />
                      </div>
                    )}
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting || !proofImage}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-5 w-5" />
                        Submit Resolution
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Alert className="bg-primary/5 border-primary/20">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <AlertDescription>
                This issue has been resolved and is pending admin verification.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
