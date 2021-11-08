import React from 'react';
import FhirClientProvider from '../components/FhirClientProvider';
import DashBoard from './DashBoard';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

export default function Home() {
  return (
    <FhirClientProvider>
      <DashBoard />
    </FhirClientProvider>
  );
}
