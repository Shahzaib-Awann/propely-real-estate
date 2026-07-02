import PropertyForm from '@/components/pages/property/property-form'
import { generateSEO } from '@/lib/seo';

/**
 * Generate static metadata for the Create Property Page
 */
export const metadata = generateSEO({
  title: "Create Property Listing",
  description:
    "Create and publish a new property listing on Propely.",
  path: "/property/add",
  noIndex: true,
});

/**
 * Create Property Page (Server Component)
 */
const CreatePropertyPage = async () => {
  return (
    <main className="flex flex-col-reverse lg:flex-row h-[calc(100vh-80px)] px-4 overflow-y-auto lg:overflow-y-hidden scroll-smooth">
      <PropertyForm key="create-mode" mode='create' />
    </main>
  )
}

export default CreatePropertyPage