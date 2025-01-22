// src/components/SuccessMessage.js
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const SuccessContainer = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const SuccessMessage = () => (
  <SuccessContainer
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0, opacity: 0 }}
  >
    <CheckCircleIcon sx={{ fontSize: 60, color: '#4CAF50', mb: 2 }} />
    <h2>Form Submitted Successfully!</h2>
    <p>We'll contact you shortly.</p>
  </SuccessContainer>
);

export default SuccessMessage;