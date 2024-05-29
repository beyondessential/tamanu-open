import React from 'react';
import { usePDF } from '@react-pdf/renderer';
import { Box, CircularProgress, Typography } from '@material-ui/core';
import styled from 'styled-components';

const FullIframe = styled.iframe`
  width: 100%;
  height: 100%;
  min-height: 50vh;
`;

const Loader = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 50vh;

  .MuiTypography-root {
    margin-top: 40px;
    font-size: 16px;
    color: ${props => props.theme.palette.text.secondary};
  }
`;

const LoadingIndicator = () => (
  <Loader>
    <CircularProgress size="5rem" />
    <Typography>Loading...</Typography>
  </Loader>
);

const ErrorDisplay = () => (
  <Box p={5} my={5}>
    <Typography variant="h5" gutterBottom>
      Error
    </Typography>
    <Typography>
      Error loading document. Please try logging in again to view the document.
    </Typography>
  </Box>
);

export const PDFLoader = React.memo(({ id, children, isLoading = false }) => {
  if (isLoading) return <LoadingIndicator />;
  return <PDFViewer id={id}>{children}</PDFViewer>;
});

// PDF Viewer should be used within a PDFLoader to ensure that any preparation of the document data is done before rendering
const PDFViewer = React.memo(({ id, children }) => {
  const [instance] = usePDF({ document: children });

  if (instance.loading) return <LoadingIndicator />;
  if (!instance.url) return <ErrorDisplay />;

  return <FullIframe src={`${instance.url}#toolbar=0`} title={id} id={id} key={id} />;
});

export const printPDF = elementId => {
  const iframe = document.getElementById(elementId);
  iframe.contentWindow.print();
};
