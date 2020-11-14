import {createMuiTheme, responsiveFontSizes} from '@material-ui/core/styles';
import deepOrange from '@material-ui/core/colors/deepOrange';

import ManierBoldTtf from './fonts/manier-bold.ttf';
import ManierBoldWoff from './fonts/manier-bold.woff';
import ManierBoldWoff2 from './fonts/manier-bold.woff2';
import ShapiroTtf from './fonts/shapiro-25-super-fly.ttf';
import ShapiroWoff from './fonts/shapiro-25-super-fly.woff';
import ShapiroWoff2 from './fonts/shapiro-25-super-fly.woff2';
import ShapiroTTtf from './fonts/shapiro-25-super-fly-text.ttf';
import ShapiroTWoff from './fonts/shapiro-25-super-fly-text.woff';
import ShapiroTWoff2 from './fonts/shapiro-25-super-fly-text.woff2';

const manier = {
  fontFamily: 'Manier-Bold',
  fontWeight: 400,
  fontStyle: 'normal',
  fontDisplay: 'swap',
  src: `url(${ManierBoldWoff}) format('woff'), url(${ManierBoldWoff2}) format('woff2'), url(${ManierBoldTtf}) format('truetype')`,
};
const shapiro = {
  fontFamily: 'Shapiro-25SuperFly',
  fontWeight: 400,
  fontStyle: 'normal',
  fontDisplay: 'swap',
  src: `url(${ShapiroWoff}) format('woff'), url(${ShapiroWoff2}) format('woff2'), url(${ShapiroTtf}) format('truetype')`,
};
const shapiroT = {
  fontFamily: 'Shapiro-25SuperFlyText',
  fontWeight: 400,
  fontStyle: 'normal',
  fontDisplay: 'swap',
  src: `url(${ShapiroTWoff}) format('woff'), url(${ShapiroTWoff2}) format('woff2'), url(${ShapiroTTtf}) format('truetype')`,
};

const light = {
  type: 'light',
  background: {
    default: '#fff',
  },
};

const theme = createMuiTheme({
  palette: {
    ...light,
    primary: deepOrange,
  },
  typography: {
    fontFamily: 'Shapiro-25SuperFlyText, Times, sans-serif',
    fontSize: 16,
    body1: {
      fontSize: 16,
    },
  },
  mixins: {
    toolbar: {
      minHeight: 96,
    },
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': [shapiroT, shapiro, manier],
      },
    },
    MuiTabs: {
      indicator: {
        visibility: 'hidden',
      },
    },
    MuiContainer: {
      maxWidthMd: {
        padding: 0,
        margin: 0,
      },
    },
  },
});

export default responsiveFontSizes(theme);
