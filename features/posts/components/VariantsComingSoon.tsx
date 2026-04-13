import { Button } from '@/components/ui/button'
import { PremiumCard } from '@/components/premium/PremiumCard'
import { 
  Layers, 
  Clock, 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin,
  ArrowRight
} from 'lucide-react'

export function VariantsComingSoon() {
  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white p-6 dark">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Post Variants</h1>
          <p className="text-gray-400">Platform-specific content variations for your posts</p>
        </div>

        {/* Coming Soon Card */}
        <PremiumCard variant="dark" className="text-center py-16">
          <div className="max-w-2xl mx-auto">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30 mb-6">
              <Layers className="h-10 w-10 text-amber-400" />
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-white mb-4">
              Variants Coming Soon
            </h2>

            {/* Description */}
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Variants will allow you to create platform-specific versions of your posts, 
              automatically adapting content for Instagram, Facebook, TikTok, LinkedIn, and Twitter.
              Each variant will maintain your core message while optimizing for platform best practices.
            </p>

            {/* Feature Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-[#111113] border border-[#2A2A2E] rounded-xl p-4">
                <Instagram className="h-6 w-6 text-pink-400 mb-2" />
                <h3 className="font-semibold text-white mb-1">Instagram</h3>
                <p className="text-gray-400 text-sm">Visual-first with hashtags</p>
              </div>
              
              <div className="bg-[#111113] border border-[#2A2A2E] rounded-xl p-4">
                <Facebook className="h-6 w-6 text-blue-400 mb-2" />
                <h3 className="font-semibold text-white mb-1">Facebook</h3>
                <p className="text-gray-400 text-sm">Engaging with links</p>
              </div>
              
              <div className="bg-[#111113] border border-[#2A2A2E] rounded-xl p-4">
                <Twitter className="h-6 w-6 text-sky-400 mb-2" />
                <h3 className="font-semibold text-white mb-1">Twitter/X</h3>
                <p className="text-gray-400 text-sm">Concise & timely</p>
              </div>
              
              <div className="bg-[#111113] border border-[#2A2A2E] rounded-xl p-4">
                <Linkedin className="h-6 w-6 text-blue-500 mb-2" />
                <h3 className="font-semibold text-white mb-1">LinkedIn</h3>
                <p className="text-gray-400 text-sm">Professional tone</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-[#111113] border border-[#2A2A2E] rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-white mb-4 flex items-center">
                <Clock className="h-5 w-5 text-amber-400 mr-2" />
                Development Timeline
              </h3>
              <div className="space-y-3 text-left max-w-md mx-auto">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <span className="text-gray-300">Platform templates & formats</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                  <span className="text-gray-400">Auto-adaptation engine</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                  <span className="text-gray-400">Bulk variant generation</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                  <span className="text-gray-400">Platform-specific scheduling</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="space-y-4">
              <Button 
                size="lg" 
                disabled
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 opacity-50 cursor-not-allowed"
              >
                Generate Variants (Coming Soon)
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              
              <p className="text-gray-500 text-sm">
                This feature is currently in development. We're building the infrastructure to 
                automatically adapt your content for each platform's unique requirements and best practices.
              </p>
            </div>
          </div>
        </PremiumCard>

        {/* Alternative CTA */}
        <PremiumCard variant="dark" className="mt-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-3">While You Wait</h3>
            <p className="text-gray-400 mb-6">
              You can still create and manage posts using our Campaign Planner. 
              All posts will be ready for variant generation when this feature launches.
            </p>
            <Button 
              variant="outline" 
              className="border-[#2A2A2E] text-gray-300 hover:bg-[#2A2A2E] hover:text-white"
            >
              Go to Posts
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </PremiumCard>
      </div>
    </div>
  )
}
