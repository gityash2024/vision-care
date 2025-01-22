import React from 'react';
import ContactLensForm from './components/ContactLensForm';
import styled from 'styled-components';

const AppContainer = styled.div`
  min-height: 100vh;
  background: #0a0a0a;
  padding: 2rem;
`;

function App() {
  return (
    <AppContainer>
      <ContactLensForm />
    </AppContainer>
  );
}

export default App;
