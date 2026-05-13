
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addTemplate() {
  const template = {
    template_id: 9,
    name: "Vela Horizon Realty",
    description: "Premium real estate platform designed for luxury property showcases and seamless client inquiries.",
    price: 1200,
    demo_url: "https://vela-horizon-realty.erpolart-ai.workers.dev/en",
    project_code: "erpolart",
    category: "Corporate",
    tech_stack: ["React", "Tailwind CSS", "Framer Motion", "Lucide Icons", "Supabase", "I18next"],
    features: [
      "Luxury Property Showcase",
      "Advanced Filtering System",
      "Multilingual Interface",
      "Automated Inquiry System",
      "Regional Property Categorization",
      "High-Performance Mobile UX",
      "Admin Control Panel",
      "Newsletter Integration"
    ]
  };

  const { data, error } = await supabase
    .from('templates')
    .insert([template])
    .select();

  if (error) {
    console.error('Error inserting template:', error);
  } else {
    console.log('Template inserted successfully:', data);
  }
}

addTemplate();
