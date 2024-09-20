'use client';
import ClipLoader from 'react-spinners/ClipLoader';

const override = {
  display: 'block',
  margin: '100px auto',
};

const LoadingPage = () => {
  return (
    <ClipLoader
      color='black'
      cssOverride={override}
      size={35}
      aria-label='Loading Spinner'
    />
  );
};
export default LoadingPage;