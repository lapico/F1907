import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react';
import {ThemeProvider, makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Collapse from '@material-ui/core/Collapse';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox/Checkbox';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import clsx from 'clsx';
import {
  BrowserRouter,
  Switch as Routes,
  Route,
  Redirect,
  NavLink,
  Link,
  useLocation,
  matchPath,
} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import animateScrollTo from 'animated-scroll-to';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import theme from './theme';

// ——————————————————————————————————————————————————————————————————————————————————— MAIN

const App = () => {
  const [datas, setDatas] = useState();

  useEffect(() => {
    // get home page datas (home '/' page id = 1)
    (async () => setDatas(await read('/1')))();
  }, []);

  useEffect(() => {
    if (!datas) return;
    document.title = datas.text_name;
  }, [datas]);

  if (!datas) return null;
  const pages = datas.children;

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter basename={process.env.REACT_APP_BASE_PATH}>
        <CssBaseline />
        <DataContextProvider>
          <Layout datas={datas}>
            <Routes>
              <Route path="/" exact>
                <Home datas={datas} />
              </Route>
              {pages.map(page => (
                <Route key={page.path} path={page.path} exact>
                  {getComponent(page)}
                </Route>
              ))}
              <Redirect to="/" />
            </Routes>
          </Layout>
        </DataContextProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

const border = {borderColor: 'divider', border: 1};
const borderT = {...border, borderLeft: 0, borderRight: 0, borderBottom: 0};
const borderB = {...border, borderLeft: 0, borderRight: 0, borderTop: 0};

const Layout = ({datas, children}) => {
  const classes = useStyles();
  const {pathname} = useLocation();
  const notRoot = matchPath(pathname, {path: '/:id'});

  if (!datas) return null;

  return (
    <Box
      pt={2}
      pb={{xs: 2, md: 10}}
      px={{xs: 2, md: 12}}
      minWidth="320px"
      className={classes.layout}
    >
      <Box
        display="flex"
        flexDirection="row-reverse"
        pb={4}
        {...(notRoot && borderB)}
      >
        <Nav pages={datas.children} border={notRoot} />
        {notRoot && <Logo img={datas.image_logo[0]} />}
      </Box>
      {children}
      {notRoot && <Footer />}
    </Box>
  );
};

const Logo = ({img}) => {
  const classes = useStyles();

  return (
    !!img && (
      <Box width="100%" pt={{xs: 0, md: 4}} pr={4}>
        <Link to="/">
          <img
            alt={img.origin.description}
            src={img.origin.httpUrl}
            className={classes.logo}
          />
        </Link>
      </Box>
    )
  );
};

const Nav = ({pages}) => {
  const classes = useStyles();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="flex-end"
      pt={{xs: 2, md: 8}}
    >
      {pages.map(page => (
        <Typography
          key={page.path}
          noWrap
          to={page.path}
          component={NavLink}
          activeClassName={classes.active}
          className={clsx(classes.manier, classes.nav)}
        >
          {page.title.toUpperCase()}
        </Typography>
      ))}
    </Box>
  );
};

const SubNav = ({pages}) => {
  const classes = useStyles();
  const [value, setValue] = useState(false);

  useEffect(() => {
    const watchScroll = () => {
      const page = pages.findIndex(page => {
        const element = document
          .querySelector(`#${page.name}`)
          .getBoundingClientRect();
        return (
          element.y < theme.spacing(14) &&
          element.y + element.height > theme.spacing(14)
        );
      });
      if (page !== value) setValue(page !== -1 ? page : false);
    };

    document.addEventListener('scroll', watchScroll);
    return () => document.removeEventListener('scroll', watchScroll);
  }, []); // eslint-disable-line

  const handleChange = (event, newValue) => {
    animateScrollTo(document.querySelector(`#${pages[newValue].name}`), {
      verticalOffset: -theme.spacing(14) + 1,
      minDuration: 800,
    });
  };

  return (
    <Box {...borderB} py={2} className={classes.subnav}>
      <Tabs
        variant="scrollable"
        textColor="primary"
        scrollButtons="auto"
        value={value}
        onChange={handleChange}
      >
        {pages.map(page => (
          <Tab
            key={page.path}
            label={page.title.toUpperCase()}
            disableRipple
            disableFocusRipple
            className={classes.manier}
          />
        ))}
      </Tabs>
    </Box>
  );
};

const Footer = () => {
  const size = useWindowSize();

  const height = useMemo(
    () => ({
      xs: size.height - theme.spacing(12),
      md: size.height - theme.spacing(20),
    }),
    [size]
  );

  if (!size.height) return null;

  return <Box mt="-1px" height={height} {...borderT} />;
};

// ——————————————————————————————————————————————————————————————————————————————————— PAGES

const getComponent = page => {
  switch (page.template) {
    case 'multiple':
      return <Multiple {...page} />;
    case 'page':
      return <Page {...page} />;
    case 'contact':
      return <Contact {...page} />;
    case 'temples':
      return <Temples {...page} />;
    default:
      return null;
  }
};

const Home = ({datas}) => {
  const classes = useStyles();

  if (!datas) return null;
  const img = datas.image_logo[1];

  return (
    <Box
      display="flex"
      flexDirection="column"
      position="absolute"
      top={0}
      left={0}
      width="100%"
      height="100%"
      pt={2}
      zIndex={-10}
      pb={{xs: 2, md: 10}}
      px={{xs: 2, md: 12}}
      className={classes.container}
    >
      <Box
        flexGrow={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
        overflow="hidden"
      >
        {!!img && (
          <img
            alt={img.origin.description}
            src={img.origin.httpUrl}
            className={classes.biglogo}
          />
        )}
      </Box>
      <Box pt={{xs: 2, md: 8}} borderTop={1}>
        {datas.text_description?.raw.split('\n').map((t, i) => (
          <Typography key={i} variant="h5" className={classes.bigtext}>
            {t}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

const Multiple = ({path}) => {
  const [datas, setDatas] = useState();

  useEffect(() => {
    (async () => setDatas(await read(path)))();
  }, []); // eslint-disable-line

  if (!datas) return null;
  const pages = datas.children;
  const nav = datas.checkbox_navigation;

  return (
    <>
      {!!nav && <SubNav pages={pages} />}

      <Box pt={4}>
        {pages.map((page, i) => (
          <div key={page.id} id={page.name}>
            {getComponent({
              ...page,
              section: true,
            })}
          </div>
        ))}
      </Box>
    </>
  );
};

const Page = page => {
  const classes = useStyles();
  const [datas, setDatas] = useState();
  const {section = false, path} = page;

  useEffect(() => {
    (async () => setDatas(await read(path)))();
  }, []); // eslint-disable-line

  if (!datas) return null;

  return (
    <Box
      pt={!section ? 4 : 0}
      width="800px"
      maxWidth="100%"
      dangerouslySetInnerHTML={{__html: datas.text_editor.formatted}}
      className={classes.editor}
    />
  );
};

const Contact = page => {
  const classes = useStyles();
  const {t} = useTranslation();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const {section = false} = page;

  const schema = useMemo(
    () =>
      yup.object().shape({
        firstname: yup.string().required(t('form.required')),
        lastname: yup.string().required(t('form.required')),
        email: yup.string().required(t('form.required')).email(t('form.email')),
      }),
    [] // eslint-disable-line
  );

  const {register, handleSubmit, errors, reset} = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async data => {
    setSending(true);
    try {
      const result = await create('/contact', {form: data});
      if (result.message === 'success') setSent(true);
      setSending(false);
    } catch (e) {
      console.log(e);
      setSending(false);
    }
  };

  return (
    <Box
      pt={!section ? 4 : 0}
      pb={4}
      width={{xs: '100%', sm: 320}}
      className={classes.contact}
    >
      {sent ? (
        <Typography
          variant="h5"
          onClick={() => {
            reset();
            setSent(false);
          }}
        >
          {t('form.success')}
        </Typography>
      ) : (
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Box pb={2}>
            <FormControlLabel
              label={t('contact.option1')}
              control={
                <Checkbox color="primary" type="checkbox" name="contact" />
              }
              inputRef={register}
            />
            <FormControlLabel
              label={t('contact.option2')}
              control={
                <Checkbox
                  color="primary"
                  type="checkbox"
                  name="documentation"
                />
              }
              inputRef={register}
            />
            <FormControlLabel
              label={t('contact.option3')}
              control={
                <Checkbox color="primary" type="checkbox" name="transfer" />
              }
              inputRef={register}
            />
          </Box>
          <Box pb={4}>
            <TextField
              label={t('contact.field1')}
              margin="none"
              fullWidth
              type="text"
              error={!!errors.firstname}
              helperText={errors.firstname?.message}
              inputRef={register}
              name="firstname"
            />
            <TextField
              label={t('contact.field2')}
              margin="none"
              fullWidth
              type="text"
              error={!!errors.lastname}
              helperText={errors.lastname?.message}
              inputRef={register}
              name="lastname"
            />
            <TextField
              label={t('contact.field3')}
              margin="none"
              fullWidth
              type="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              inputRef={register}
              name="email"
            />
            <TextField
              label={t('contact.field4')}
              margin="none"
              fullWidth
              type="tel"
              inputRef={register}
              name="tel"
            />
            <TextField
              label={t('contact.field5')}
              margin="none"
              fullWidth
              multiline
              rows={4}
              type="text"
              inputRef={register}
              name="notes"
            />
          </Box>
          <Box pb={4}>
            <Button
              variant="outlined"
              size="small"
              endIcon={sending && <CircularProgress size={16} />}
              type="submit"
            >
              {t('contact.submit')}
            </Button>
          </Box>
        </form>
      )}
    </Box>
  );
};

const Temples = ({path}) => {
  const [datas, setDatas] = useState();

  useEffect(() => {
    (async () => setDatas(await read(`${path}?children=true`)))();
  }, []); // eslint-disable-line

  if (!datas) return null;
  console.log(datas);

  return (
    <>
      <Bar />
      <Box py={4}>
        <List items={datas.children} />
        <Map image={datas.image_map[0]} />
      </Box>
    </>
  );
};

const Bar = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  return (
    <Box className={classes.bar}>
      <Box
        {...borderB}
        py={2}
        height={theme.spacing(10) + 1}
        display="flex"
        flexDirection="row"
      >
        <IconButton
          disableRipple
          onClick={() => setOpen(!open)}
          className={clsx(classes.expand, {
            [classes.expandOpen]: open,
          })}
        >
          <ExpandMoreIcon />
        </IconButton>
      </Box>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Fade in={open} {...(open ? {timeout: 1000} : {})}>
          <Box {...borderB} p={2} display="flex" justifyContent="flex-end">
            <Box mr={2}>
              <FormControlLabel
                label={
                  <Typography className={classes.manier}>CARTE</Typography>
                }
                control={<Switch color="primary" />}
                labelPlacement="start"
                edge="start"
              />
            </Box>
            <Box>
              <FormControlLabel
                label={
                  <Typography className={classes.manier}>GRILLE</Typography>
                }
                control={<Switch color="primary" />}
                labelPlacement="start"
                edge="start"
              />
            </Box>
          </Box>
        </Fade>
      </Collapse>
    </Box>
  );
};

const Map = ({image}) => {
  const size = useWindowSize();

  if (!image) return null;

  const width = size.width;
  const height = size.height;
  const portrait = width / height < 1.0;
  const rotation = portrait ? '-90deg' : '0deg';
  const scale = portrait
    ? width / image.origin.height
    : height / image.origin.height;

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width={width}
      height={height}
      zIndex={-10}
    >
      <div
        style={{
          width: image.origin.width,
          height: image.origin.height,
          position: 'relative',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation})`,
          transformOrigin: 'center center',
        }}
      >
        <img
          alt="map"
          src={image.origin.httpUrl}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </div>
    </Box>
  );
};

const List = ({items}) => {
  return (
    <>
      {items.map(item => (
        <Typography key={item.name} variant="h3">
          {item.title}
        </Typography>
      ))}
    </>
  );
};

// ——————————————————————————————————————————————————————————————————————————————————— STYLES

const useStyles = makeStyles(theme => ({
  manier: {
    fontFamily: 'Manier-Bold',
    letterSpacing: '0.05em',
    color: theme.palette.text.primary,
  },
  layout: {
    animation: '$fadein ease 2s',
  },
  '@keyframes fadein': {
    '0%': {
      opacity: 0,
    },
    '100%': {
      opacity: 1,
    },
  },
  logo: {
    width: theme.spacing(25),
    maxWidth: '100%',
  },
  biglogo: {
    width: theme.spacing(100),
    maxWidth: '100%',
    maxHeight: '100%',
    padding: theme.spacing(2),
  },
  bigtext: {
    lineHeight: 1.1,
  },
  active: {
    color: theme.palette.primary.main,
  },
  nav: {
    textDecoration: 'none',
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  subnav: {
    position: 'sticky',
    top: 0,
    backgroundColor: theme.palette.background.default,
  },
  bar: {
    position: 'sticky',
    top: 0,
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  contact: {
    '& form > div > div': {
      marginBottom: theme.spacing(2),
    },
    '& label > span': {
      marginRight: theme.spacing(),
    },
    '& h5': {
      cursor: 'pointer',
    },
  },
  editor: {
    overflow: 'hidden',
    '& a': {
      color: theme.palette.text.primary,
    },
    '& a:hover': {
      color: theme.palette.primary.main,
    },
    '& > *': {
      margin: 0,
      fontSize: theme.typography.fontSize,
    },
    '& > h1': {
      fontWeight: 'normal',
    },
    '& > h2': {
      fontWeight: 'bold',
      marginBottom: theme.spacing(4),
    },
    '& > h3': {
      fontWeight: 'normal',
      fontStyle: 'italic',
    },
    '& > hr': {
      border: 'solid 1px',
      borderTop: 0,
      borderLeft: 0,
      borderRight: 0,
      borderColor: theme.palette.divider,
    },
    '& > hr, & > p': {
      marginBottom: theme.spacing(4),
    },
    '& > ul': {
      listStyle: 'square outside none',
      paddingLeft: theme.spacing(3),
      marginBottom: theme.spacing(4),
    },
    '& > .ip': {
      [theme.breakpoints.up('sm')]: {
        float: 'left',
        width: '35%',
        clear: 'both',
        fontStyle: 'normal',
        '& + p': {
          float: 'left',
          width: '65%',
          paddingLeft: theme.spacing(),
        },
        '& + p + *': {
          clear: 'both',
        },
      },
    },
  },
}));

export default App;

// ——————————————————————————————————————————————————————————————————————————————————— API

const endpoint = process.env.REACT_APP_API_URL;

const create = async (url = '', data = {}) => {
  const response = await fetch(`${endpoint}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

const read = async url => {
  const response = await fetch(`${endpoint}${url}`);
  return response.json();
};

// ——————————————————————————————————————————————————————————————————————————————————— HOOKS

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const resize = () =>
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    resize();

    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return windowSize;
};

// ——————————————————————————————————————————————————————————————————————————————————— STORE

const DataContext = createContext();
const useData = () => useContext(DataContext);
const DataContextProvider = ({children}) => {
  const hello = 'hello';
  return (
    <DataContext.Provider value={{hello}}>{children}</DataContext.Provider>
  );
};
