'use client'

import { useRouter } from 'next/navigation'

export default function Welcome() {
  const router = useRouter()

  const handleUploadClick = () => {
    // This will navigate to the upload page
    router.push('/dashboard?showUpload=true')
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Welcome to Expai!</h2>
      <p className="mb-6 max-w-md">
        Get started by uploading your first bank statement to analyze your
        spending patterns and get personalized financial insights.
      </p>
      <button
        onClick={handleUploadClick}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors"
      >
        Upload Your First Statement
      </button>
    </div>
  )
}
