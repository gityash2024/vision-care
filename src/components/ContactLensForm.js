import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
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
  Snackbar,
  Alert,
} from '@mui/material';
import { DarkMode, KeyboardArrowDown } from '@mui/icons-material';

const GlobalStyle = createGlobalStyle`
  .MuiSelect-icon {
    color: ${props => props.theme.primary} !important;
    right: 7px !important;
    width: 24px !important;
    height: 24px !important;
    top: calc(50% - 12px) !important;
  }
`;

const lightTheme = {
  background: '#ffffff',
  cardBg: '#f5f5f5',
  text: '#000000',
  inputBg: '#ffffff',
  inputBorder: '#e0e0e0',
  placeholder: '#666666',
  primary: '#44d09f',
  error: '#ff4d4d',
};

const darkTheme = {
  background: '#111111',
  cardBg: '#1a1a1a',
  text: '#ffffff',
  inputBg: '#1a1a1a',
  inputBorder: '#333333',
  placeholder: '#999999',
  primary: '#44d09f',
  error: '#ff4d4d',
};

const ThemeToggleWrapper = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.text};
  cursor: pointer;
  padding: 8px;
  
  .MuiSwitch-root {
    margin: 0 8px;
  }
  
  svg {
    cursor: pointer;
  }
`;

const StyledForm = styled(motion.div)`
  background: ${props => props.theme.cardBg};
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  margin: 2rem auto;
  max-width: 1000px;
  font-family: 'Inter', sans-serif;
  color: ${props => props.theme.text};
  position: relative;
`;

const StyledField = styled(Field)`
  && {
    .MuiOutlinedInput-root {
      background: ${props => props.theme.inputBg};
      border-radius: 12px;
      color: ${props => props.theme.text};
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
      }
      
      fieldset {
        border-color: ${props => props.theme.inputBorder};
      }
      
      &.Mui-focused fieldset {
        border-color: ${props => props.theme.primary};
      }
      
      input {
        color: ${props => props.theme.text};
        
        &::placeholder {
          color: ${props => props.theme.placeholder};
        }
      }
    }
    
    .MuiFormLabel-root {
      color: ${props => props.theme.placeholder};
      
      &.Mui-focused {
        color: ${props => props.theme.primary};
      }
    }
    
    .MuiFormHelperText-root {
      color: ${props => props.theme.error};
    }
  }
`;

const StyledFormControl = styled(FormControl)`
  && {
    .MuiFormLabel-root {
      color: ${props => props.theme.placeholder};
    }
    
    .MuiRadio-root {
      color: ${props => props.theme.placeholder};
      
      &.Mui-checked {
        color: ${props => props.theme.primary};
      }
    }
    
    .MuiFormControlLabel-label {
      color: ${props => props.theme.text};
    }
    
    .MuiSelect-root {
      background: ${props => props.theme.inputBg};
      color: ${props => props.theme.text};
      border-radius: 12px;
      padding: 12px 16px;
      border: 1px solid ${props => props.theme.inputBorder};
      cursor: pointer;
      
      &:hover {
        border-color: ${props => props.theme.primary};
      }
      
      &.Mui-focused {
        border-color: ${props => props.theme.primary};
        background: ${props => props.theme.inputBg};
      }

      .MuiSelect-select {
        padding: 12px 16px;
        background: transparent !important;
        color: ${props => props.theme.text} !important;

        &.MuiInputBase-input {
          padding-right: 32px;
        }

        &::placeholder {
          color: ${props => props.theme.placeholder};
        }
      }
    }
    
    .MuiOutlinedInput-notchedOutline {
      border: none;
    }
  }
`;

const StyledMenuItem = styled(MenuItem)`
  && {
    color: ${props => props.theme.text};
    background: ${props => props.theme.inputBg};
    padding: 12px 16px;
    
    &:hover {
      background: ${props => props.theme.primary}22;
    }
    
    &.Mui-selected {
      background: ${props => props.theme.primary}33;
      
      &:hover {
        background: ${props => props.theme.primary}44;
      }
    }
  }
`;

const AnimatedButton = styled(motion.button)`
  background: ${props => props.theme.primary};
  color: #000000;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  width: 200px;
  margin: 0 auto;
  display: block;
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

const FormSection = styled(motion.div)`
  margin: 1.5rem 0;
`;

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
  rightEyeS: Yup.number().when('hasPreviousLenses', {
    is: 'false',
    then: () => Yup.number().required('Right eye S value is required')
  }),
  leftEyeS: Yup.number().when('hasPreviousLenses', {
    is: 'false',
    then: () => Yup.number().required('Left eye S value is required')
  }),
  wantMultifocal: Yup.string().required('Please select multifocal preference')
});

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

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwfQX2BWU8FX5wUsVoMqlG8W6ZOat6FxaXNLkMePkZqR1ZA8H9a21ax0pbyANKvNzzJwA/exec';

const ContactLensForm = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
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
    rightEyeS: '',
    rightEyeC: '',
    rightEyeA: '',
    rightEyeAdd: '',
    leftEyeS: '',
    leftEyeC: '',
    leftEyeA: '',
    leftEyeAdd: '',
    wantMultifocal: '',
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    setIsSubmitting(true);
    try {
      const formData = {
        name: values.name,
        mobile: values.mobile, 
        age: values.age,
        gender: values.gender,
        hasPreviousLenses: values.hasPreviousLenses,
        toric: values.toric,
        wearingSchedule: values.wearingSchedule,
        lensType: values.lensType,
        rightEyeS: values.rightEyeS,
        rightEyeC: values.rightEyeC,
        rightEyeA: values.rightEyeA,
        rightEyeAdd: values.rightEyeAdd,
        leftEyeS: values.leftEyeS,
        leftEyeC: values.leftEyeC,
        leftEyeA: values.leftEyeA,
        leftEyeAdd: values.leftEyeAdd,
        wantMultifocal: values.wantMultifocal
      };
  
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
  
      setSubmitStatus({
        open: true,
        severity: 'success',
        message: 'Form submitted successfully!'
      });
      resetForm();
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
      'My day', 'Aspire go max', 'Aspire go',
      'Biotrue', 'Moist', 'I connect'
    ]
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <StyledForm
        initial="hidden"
        animate="visible"
        variants={formVariants}
      >
        <ThemeToggleWrapper onClick={() => setIsDarkMode(!isDarkMode)}>
          <DarkMode />
        </ThemeToggleWrapper>
        <div style={{textAlign: 'center', marginBottom: '20px'}}>
          <h1 style={{marginBottom: '20px', color: '#44d09f', fontWeight: 'bold'}} className="form-title">
            Vision Care Contact Lens Form
          </h1>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur }) => (
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
                        value={values.name}
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
                        type="tel"
                        as={TextField}
                        label="Mobile"
                        value={values.mobile}
                        fullWidth
                        error={touched.mobile && errors.mobile}
                        helperText={touched.mobile && errors.mobile}
                        onChange={handleChange}  
                        onBlur={handleBlur}
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <StyledField
                        name="age"
                        as={TextField}
                        label="Age"
                        type="number"
                        value={values.age}
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
                              displayEmpty
                              IconComponent={KeyboardArrowDown}
                            >
                              <StyledMenuItem disabled value="">
                                Select Wearing Schedule
                              </StyledMenuItem>
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
                                displayEmpty
                                IconComponent={KeyboardArrowDown}
                              >
                                <StyledMenuItem disabled value="">
                                  Select Lens Type
                                </StyledMenuItem>
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
                        <Grid item xs={12}>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse" style={{ borderColor: isDarkMode ? '#333333' : '#e0e0e0' }}>
                              <thead>
                                <tr>
                                  <th className="p-2 border text-left" style={{ borderColor: 'inherit' }}></th>
                                  <th className="p-2 border text-center" style={{ borderColor: 'inherit' }}>S</th>
                                  <th className="p-2 border text-center" style={{ borderColor: 'inherit' }}>C</th>
                                  <th className="p-2 border text-center" style={{ borderColor: 'inherit' }}>A</th>
                                  <th className="p-2 border text-center" style={{ borderColor: 'inherit' }}>ADD</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="p-2 border font-medium" style={{ borderColor: 'inherit' }}>RE</td>
                                  <td className="p-2 border" style={{ borderColor: 'inherit' }}>
                                    <StyledField
                                      name="rightEyeS"
                                      as={TextField}
                                      type="number"
                                      fullWidth
                                      size="small"
                                      error={touched.rightEyeS && errors.rightEyeS}
                                      helperText={touched.rightEyeS && errors.rightEyeS}
                                      inputProps={{ step: 0.25 }}
                                      onChange={handleChange}  // Add this
  onBlur={handleBlur}  
                                    />
                                  </td>
                                  <td className="p-2 border" style={{ borderColor: 'inherit' }}>
                                    <StyledField
                                      name="rightEyeC"
                                      as={TextField}
                                      type="number"
                                      fullWidth
                                      size="small"
                                      inputProps={{ step: 0.25 }}
                                      onChange={handleChange}  // Add this
  onBlur={handleBlur}  
                                    />
                                  </td>
                                  <td className="p-2 border" style={{ borderColor: 'inherit' }}>
                                    <StyledField
                                      name="rightEyeA"
                                      as={TextField}
                                      type="number"
                                      fullWidth
                                      size="small"
                                      inputProps={{ step: 1 }}
                                      onChange={handleChange}  // Add this
  onBlur={handleBlur}  
                                    />
                                  </td>
                                  <td className="p-2 border" style={{ borderColor: 'inherit' }}>
                                    <StyledField
                                      name="rightEyeAdd"
                                      as={TextField}
                                      type="number"
                                      fullWidth
                                      size="small"
                                      inputProps={{ step: 0.25 }}
                                      onChange={handleChange}  // Add this
  onBlur={handleBlur}  
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td className="p-2 border font-medium" style={{ borderColor: 'inherit' }}>LE</td>
                                  <td className="p-2 border" style={{ borderColor: 'inherit' }}>
                                    <StyledField
                                      name="leftEyeS"
                                      as={TextField}
                                      type="number"
                                      fullWidth
                                      size="small"
                                      error={touched.leftEyeS && errors.leftEyeS}
                                      helperText={touched.leftEyeS && errors.leftEyeS}
                                      inputProps={{ step: 0.25 }}
                                      onChange={handleChange}  // Add this
  onBlur={handleBlur}  
                                    />
                                  </td>
                                  <td className="p-2 border" style={{ borderColor: 'inherit' }}>
                                    <StyledField
                                      name="leftEyeC"
                                      as={TextField}
                                      type="number"
                                      fullWidth
                                      size="small"
                                      inputProps={{ step: 0.25 }}
                                      onChange={handleChange}  // Add this
  onBlur={handleBlur}  
                                    />
                                  </td>
                                  <td className="p-2 border" style={{ borderColor: 'inherit' }}>
                                    <StyledField
                                      name="leftEyeA"
                                      as={TextField}
                                      type="number"
                                      fullWidth
                                      size="small"
                                      inputProps={{ step: 1 }}
                                      onChange={handleChange}  // Add this
  onBlur={handleBlur}  
                                    />
                                  </td>
                                  <td className="p-2 border" style={{ borderColor: 'inherit' }}>
                                    <StyledField
                                      name="leftEyeAdd"
                                      as={TextField}
                                      type="number"
                                      fullWidth
                                      size="small"
                                      inputProps={{ step: 0.25 }}
                                      onChange={handleChange}  // Add this
  onBlur={handleBlur}  
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
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

                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <AnimatedButton
                    type="submit"
                    whileHover={{ scale: 1.05, rotate: 1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
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
    </ThemeProvider>
  );
};

export default ContactLensForm;