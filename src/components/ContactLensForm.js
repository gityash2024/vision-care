import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import {
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';

const StyledForm = styled(motion.div)`
  background: #111111;
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  margin: 2rem auto;
  max-width: 1000px;
  font-family: 'Inter', sans-serif;
  color: #ffffff;
`;

const StyledField = styled(Field)`
  && {
    .MuiOutlinedInput-root {
      background: #1a1a1a;
      border-radius: 12px;
      color: #ffffff;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
      }
      
      fieldset {
        border-color: #333;
      }
      
      &.Mui-focused fieldset {
        border-color: #44d09f;
      }
      
      input {
        color: #ffffff;
        
        &::placeholder {
          color: #666;
        }
      }
    }
    
    .MuiFormLabel-root {
      color: #999;
      
      &.Mui-focused {
        color: #44d09f;
      }
    }
    
    .MuiFormHelperText-root {
      color: #ff4d4d;
    }
  }
`;

const AnimatedButton = styled(motion.button)`
  background: #44d09f;
  color: #000000;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  width: 100%;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
  
  &:hover {
    background: #3ab38d;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(68, 208, 159, 0.2);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const StyledFormControl = styled(FormControl)`
  && {
    .MuiFormLabel-root {
      color: #999;
    }
    
    .MuiRadio-root {
      color: #666;
      
      &.Mui-checked {
        color: #44d09f;
      }
    }
    
    .MuiFormControlLabel-label {
      color: #fff;
    }
    
    .MuiSelect-root {
      background: #1a1a1a;
      color: #fff;
      border-radius: 12px;
      
      &:before, &:after {
        border-color: #333;
      }
      
      &.Mui-focused {
        border-color: #44d09f;
      }
    }
  }
`;

const StyledMenuItem = styled(MenuItem)`
  && {
    color: #fff;
    background: #1a1a1a;
    
    &:hover {
      background: #222;
    }
  }
`;

const FormSection = styled(motion.div)`
  margin: 1.5rem 0;
`;

const formVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const sectionVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5 }
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: { duration: 0.3 }
  }
};

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  mobile: Yup.string().matches(/^[0-9]{10}$/, 'Invalid mobile number').required('Mobile number is required'),
  age: Yup.number().positive('Age must be positive').required('Age is required'),
  gender: Yup.string().required('Gender is required'),
  hasPreviousLenses: Yup.string().required('This field is required'),
  toric: Yup.string().when('hasPreviousLenses', {
    is: 'true',
    then: () => Yup.string().required('Please select toric option')
  }),
  wearingSchedule: Yup.string().when('hasPreviousLenses', {
    is: 'true',
    then: () => Yup.string().required('Please select wearing schedule')
  }),
  lensType: Yup.string().when('hasPreviousLenses', {
    is: 'true',
    then: () => Yup.string().required('Please select lens type')
  }),
  rightEyePower: Yup.number().when('hasPreviousLenses', {
    is: 'false',
    then: () => Yup.number().required('Right eye power is required')
  }),
  leftEyePower: Yup.number().when('hasPreviousLenses', {
    is: 'false',
    then: () => Yup.number().required('Left eye power is required')
  }),
  wantMultifocal: Yup.string().required('Please select multifocal preference')
});

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzMyqfklNMu4kA8NpeID2F9UczDcoM_0aAy8_-obqMAx210hSZCC0OvlLP7KxPm2Pls/exec';

const ContactLensForm = () => {
  const [submitStatus, setSubmitStatus] = useState({ open: false, severity: 'success', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = {
    name: '',
    mobile: '',
    age: '',
    gender: '',
    hasPreviousLenses: '',
    toric: '',
    wearingSchedule: '',
    lensType: '',
    rightEyePower: '',
    leftEyePower: '',
    wantMultifocal: '',
  };

  useEffect(() => {
    gsap.from('.form-title', {
      y: -50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });
  }, []);
  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    setIsSubmitting(true);
    try {
      const formBody = `name=${encodeURIComponent(values.name)}&` +
        `mobile=${encodeURIComponent(values.mobile)}&` +
        `age=${encodeURIComponent(values.age)}&` +
        `gender=${encodeURIComponent(values.gender)}&` +
        `hasPreviousLenses=${encodeURIComponent(values.hasPreviousLenses)}&` +
        `toric=${encodeURIComponent(values.toric)}&` +
        `wearingSchedule=${encodeURIComponent(values.wearingSchedule)}&` +
        `lensType=${encodeURIComponent(values.lensType)}&` +
        `rightEyePower=${encodeURIComponent(values.rightEyePower)}&` +
        `leftEyePower=${encodeURIComponent(values.leftEyePower)}&` +
        `wantMultifocal=${encodeURIComponent(values.wantMultifocal)}`;
  
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody
      });
  
      setSubmitStatus({
        open: true,
        severity: 'success',
        message: 'Form submitted successfully!'
      });
      resetForm();
      gsap.to('.form-success', {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'power3.out'
      });
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus({
        open: true,
        severity: 'error',
        message: 'Failed to submit form. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSubmitStatus({ ...submitStatus, open: false });
  };

  const lensTypes = {
    yearly: ['OPTIMA'],
    monthly: [
      'SLS', 'Acuvue2', 'BIOMED',
      'PV2', 'Ultra', 'ASPIRE AIR',
      'Asphira Pro'
    ],
    daily: [
      'Moist', 'Biotrue', 'MyDay',
      'Aspire GoMax', 'Aspire 90', 'Iconroc'
    ]
  };

  return (
    <>
      <StyledForm
        initial="hidden"
        animate="visible"
        variants={formVariants}
      >
        <Typography 
          variant="h4" 
          className="form-title"
          sx={{ 
            textAlign: 'center',
            mb: 4,
            color: '#ffffff',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: '2rem'
          }}
        >
          Vision Care Contact Lens Form
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          validateOnChange={true}
          validateOnBlur={true}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form noValidate>
              <Grid container spacing={3}>
                <FormSection
                  component={motion.div}
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <StyledField
                        name="name"
                        as={TextField}
                        label="Name"
                        fullWidth
                        error={touched.name && errors.name}
                        helperText={touched.name && errors.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <StyledField
                        name="mobile"
                        as={TextField}
                        label="Mobile"
                        fullWidth
                        error={touched.mobile && errors.mobile}
                        helperText={touched.mobile && errors.mobile}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <StyledField
                        name="age"
                        as={TextField}
                        label="Age"
                        type="number"
                        fullWidth
                        error={touched.age && errors.age}
                        helperText={touched.age && errors.age}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <StyledFormControl fullWidth error={touched.gender && errors.gender}>
                        <FormLabel>Gender</FormLabel>
                        <Field name="gender">
                          {({ field }) => (
                            <RadioGroup {...field} row>
                              <FormControlLabel value="male" control={<Radio />} label="Male" />
                              <FormControlLabel value="female" control={<Radio />} label="Female" />
                            </RadioGroup>
                          )}
                        </Field>
                      </StyledFormControl>
                    </Grid>
                  </Grid>
                </FormSection>

                <Grid item xs={12}>
                  <StyledFormControl fullWidth error={touched.hasPreviousLenses && errors.hasPreviousLenses}>
                    <FormLabel>Have you ever tried contact lenses?</FormLabel>
                    <Field name="hasPreviousLenses">
                      {({ field }) => (
                        <RadioGroup {...field} row>
                          <FormControlLabel value="true" control={<Radio />} label="Yes" />
                          <FormControlLabel value="false" control={<Radio />} label="No" />
                        </RadioGroup>
                      )}
                    </Field>
                  </StyledFormControl>
                </Grid>

                <AnimatePresence>
                  {values.hasPreviousLenses === 'true' && (
                    <FormSection
                      component={motion.div}
                      variants={sectionVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <StyledFormControl fullWidth error={touched.toric && errors.toric}>
                            <FormLabel>Toric</FormLabel>
                            <Field name="toric">
                              {({ field }) => (
                                <RadioGroup {...field} row>
                                  <FormControlLabel value="true" control={<Radio />} label="Yes" />
                                  <FormControlLabel value="false" control={<Radio />} label="No" />
                                </RadioGroup>
                              )}
                            </Field>
                          </StyledFormControl>
                        </Grid>

                        <Grid item xs={12}>
                          <StyledFormControl fullWidth error={touched.wearingSchedule && errors.wearingSchedule}>
                            <FormLabel>Wearing Schedule</FormLabel>
                            <Field
                              name="wearingSchedule"
                              as={Select}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            >
                              <StyledMenuItem value="yearly">Yearly</StyledMenuItem>
                              <StyledMenuItem value="monthly">Monthly</StyledMenuItem>
                              <StyledMenuItem value="daily">Daily</StyledMenuItem>
                            </Field>
                          </StyledFormControl>
                        </Grid>

                        {values.wearingSchedule && (
                          <Grid item xs={12}>
                            <StyledFormControl fullWidth error={touched.lensType && errors.lensType}>
                              <FormLabel>Lens Type</FormLabel>
                              <Field
                                name="lensType"
                                as={Select}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              >
                                {lensTypes[values.wearingSchedule]?.map((lens) => (
                                  <StyledMenuItem key={lens} value={lens}>
                                    {lens}
                                  </StyledMenuItem>
                                ))}
                              </Field>
                            </StyledFormControl>
                          </Grid>
                        )}
                      </Grid>
                    </FormSection>
                  )}

                  {values.hasPreviousLenses === 'false' && (
                    <FormSection
                      component={motion.div}
                      variants={sectionVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                          <StyledField
                            name="rightEyePower"
                            as={TextField}
                            label="Right Eye Power"
                            type="number"
                            fullWidth
                            error={touched.rightEyePower && errors.rightEyePower}
                            helperText={touched.rightEyePower && errors.rightEyePower}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <StyledField
                            name="leftEyePower"
                            as={TextField}
                            label="Left Eye Power"
                            type="number"
                            fullWidth
                            error={touched.leftEyePower && errors.leftEyePower}
                            helperText={touched.leftEyePower && errors.leftEyePower}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Grid>
                      </Grid>
                    </FormSection>
                  )}
                </AnimatePresence>

                <Grid item xs={12}>
                  <StyledFormControl fullWidth error={touched.wantMultifocal && errors.wantMultifocal}>
                    <FormLabel>Want to buy multifocal CL?</FormLabel>
                    <Field name="wantMultifocal">
                      {({ field }) => (
                        <RadioGroup {...field} row>
                          <FormControlLabel value="true" control={<Radio />} label="Yes" />
                          <FormControlLabel value="false" control={<Radio />} label="No" />
                        </RadioGroup>
                      )}
                    </Field>
                  </StyledFormControl>
                </Grid>

                <Grid item xs={12}>
                  <AnimatedButton
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Form'}
                  </AnimatedButton>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </StyledForm>

      <Snackbar 
        open={submitStatus.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={submitStatus.severity}
          sx={{ 
            width: '100%',
            bgcolor: submitStatus.severity === 'success' ? '#44d09f' : undefined,
            color: submitStatus.severity === 'success' ? '#000' : undefined,
          }}
        >
          {submitStatus.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ContactLensForm;