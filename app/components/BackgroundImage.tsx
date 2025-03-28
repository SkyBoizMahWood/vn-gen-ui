type BackgroundImageProps = {
  imageUrl: string;
  children: React.ReactNode;
};

export default function BackgroundImage({ imageUrl, children }: BackgroundImageProps) {
  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
} 