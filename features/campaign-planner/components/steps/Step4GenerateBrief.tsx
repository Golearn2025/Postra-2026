'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, Copy, CheckCircle2 } from 'lucide-react'

interface Step4Props {
  aiBrief: string
  onNext: () => void
  onPrevious: () => void
}

export function Step4GenerateBrief({ aiBrief, onNext, onPrevious }: Step4Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(aiBrief)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Generate AI Brief</h2>
        <p className="text-muted-foreground">
          Copy this brief and paste it into ChatGPT or your preferred AI tool to generate your content plan.
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex gap-2">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-amber-900 mb-1">How to use this brief</p>
            <ol className="text-amber-700 space-y-1 list-decimal list-inside">
              <li>Click "Copy Brief" below</li>
              <li>Open ChatGPT, Claude, or your preferred AI tool</li>
              <li>Paste the brief and send</li>
              <li>Copy the AI's response</li>
              <li>Return here and click "Next Step" to paste the output</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute top-3 right-3 z-10">
          <Button
            onClick={handleCopy}
            size="sm"
            variant={copied ? "default" : "outline"}
            className="gap-2"
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Brief
              </>
            )}
          </Button>
        </div>
        
        <div className="bg-slate-900 text-slate-100 rounded-lg p-6 pr-32 max-h-[500px] overflow-y-auto font-mono text-sm">
          <pre className="whitespace-pre-wrap break-words">{aiBrief}</pre>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-2">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-900 mb-1">Pro tip</p>
            <p className="text-blue-700">
              For best results, use ChatGPT-4 or Claude. Tell the AI to return only the raw JSON array without any markdown formatting or code blocks.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-3">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button onClick={onNext}>
          Next Step
        </Button>
      </div>
    </div>
  )
}
