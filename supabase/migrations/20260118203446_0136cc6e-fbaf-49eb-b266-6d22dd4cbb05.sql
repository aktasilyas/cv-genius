-- Create CVs table for storing user resumes
CREATE TABLE public.cvs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled CV',
  cv_data JSONB NOT NULL,
  selected_template TEXT NOT NULL DEFAULT 'modern',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.cvs ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own CVs" 
ON public.cvs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own CVs" 
ON public.cvs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own CVs" 
ON public.cvs 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own CVs" 
ON public.cvs 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for faster user queries
CREATE INDEX idx_cvs_user_id ON public.cvs(user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_cvs_updated_at
BEFORE UPDATE ON public.cvs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();