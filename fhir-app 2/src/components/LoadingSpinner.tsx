import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import '../pages/style.css';

export function LoadingSpinner(props: any) {
  const { loadingText } = props;
  return (
    <div className='loading-container'>
      <Button variant='primary' disabled size='lg'>
        <Spinner as='span' animation='grow' size='sm' role='status' aria-hidden='true' />
        {loadingText || 'Loading...'}
      </Button>
    </div>
  );
}
