import { ImageResponse } from 'next/og';
 
export const runtime = 'edge';
 
export const alt = 'Condition Healthy - Clinical Trial Finder';
export const size = {
  width: 1200,
  height: 630,
};
 
export const contentType = 'image/png';
 
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #eff6ff, #ffffff)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
             {/* Logo Icon */}
             <svg width="80" height="80" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="256" height="256" rx="60" fill="#2563eb"/>
                <path d="M96 178C80.5 178 68.5 173.5 60 164.5C51.5 155.5 47.25 143 47.25 127C47.25 111 51.5 98.75 60 90.25C68.5 81.75 81.5 77.5 99 77.5C108.5 77.5 116.5 79 123 82L119 104C113.5 101 107.5 99.5 101 99.5C92.5 99.5 86.25 102 82.25 107C78.25 112 76.25 119 76.25 128C76.25 137 78.25 143.75 82.25 148.25C86.25 152.75 92.25 155 100.25 155C107.25 155 114 153.25 120.5 149.75L124.75 170.75C116.25 175.583 106.667 178 96 178ZM148 175V80H176V114H208.5V80H236.5V175H208.5V136.5H176V175H148Z" fill="white"/>
             </svg>
             <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 60, fontWeight: 900, color: '#111827', letterSpacing: '-0.05em' }}>Condition</div>
                <div style={{ fontSize: 60, fontWeight: 300, color: '#2563eb', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '-10px' }}>Healthy</div>
             </div>
        </div>
        <div style={{ marginTop: '40px', fontSize: 24, padding: '10px 30px', background: '#dbeafe', color: '#1e40af', borderRadius: '50px', fontWeight: 600 }}>
             Official Research Directory 2026
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
