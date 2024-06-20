// variants
import CopyrightXL from '../../components/Copyright_xl';

const Confirmation = () => {
  return (
    <div className='bg-primary/60 h-full'>
      {/* bg image */}
      <div className='w-full h-full absolute right-0 bottom-0'>
        
        <div className='flex flex-col justify-center xl:pt-12 xl:text-center text-4xl h-full container mx-auto'>
          Your book has been created 🙃
        </div>

      </div>
      <CopyrightXL />
    </div>
  );
};

export default Confirmation;