import { Header } from '@/components/common/Header';
import { Progress } from '@/components/ui/progress';

export default function LetterNewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">

      {/* Header */}
			<Header title="목소리 담기"/>

			{/* Progress */}
      <section className='px-5 py-[10px]'>
        <Progress value={50} className='bg-gray-300 rounded-full h-[4px]' indicatorClassName='bg-gray-500' />
      </section>

      <main>{children}</main>
    </div>
  );
}