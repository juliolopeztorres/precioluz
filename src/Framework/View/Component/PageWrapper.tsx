import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';

interface Props {
  title?: string,
  children?: React.ReactNode
}

const Copyright = (props: any) => <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Typescript + React + Material UI - '}
      <Link color="inherit" href="https://github.com/juliolopeztorres" target={'_blank'}>
        Julio
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>

export const PageWrapper = (props: Props) => <>
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <CssBaseline />
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: 'wrap' }}>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            Precio diario de la luz
          </Typography>
        </Toolbar>
      </AppBar>
      {props.children}
      {/* Footer */}
      <Container
        maxWidth="md"
        component="footer"
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          mt: 8,
          py: [3, 6],
        }}
      >
        <Copyright sx={{ mt: 5 }} />
      </Container>
</>
