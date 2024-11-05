import { DarkMode, LightMode } from "@mui/icons-material";
import AddCommentIcon from '@mui/icons-material/AddComment';
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import SendIcon from "@mui/icons-material/Send";
import { Box, Button, TextField } from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { createTheme, styled, useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { AppProvider } from "@toolpad/core/AppProvider";
import * as React from "react";
import { fetchChats, fetchMessagesFromChat, newChat, sendMessageToChat } from "../lib";
import { ButtonApagar } from "./buttonApagar";

const drawerWidth = 240;

const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    variants: [
      {
        props: ({ open }) => open,
        style: {
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          marginLeft: 0,
        },
      },
    ],
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(["margin", "width"], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));
export default function MainProgram(props) {
  const { window } = props;
  const demoWindow = window ? window() : undefined;
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [selectedChat, setSelectedChat] = React.useState(null);
  const [buttons, setButtons] = React.useState([]);
  const [messages, setMessages] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const [darkMode, setDarkMode] = React.useState(true);
  const messagesEndRef = React.useRef(null);
  const [possoMandarMensagem, setPossoMandarMensagem] = React.useState(true);
  React.useEffect(() => {
    async function getChats() {
      await fetchChats(setButtons);
    }
    getChats();
  }, []);

  const buscarLogs = async (id) => {
    setSelectedChat(id);
    await fetchMessagesFromChat(id, setMessages);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <AppProvider
      theme={darkMode ? darkTheme : lightTheme}
      window={demoWindow}
      sx={{ display: "flex" }}
    >
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                mr: 2,
              },
              open && { display: "none" },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Chat com a IA
          </Typography>
          <Box sx={{ position: 'absolute', right: 0 }}>
            <IconButton onClick={handleThemeChange} sx={{ color: "white" }}>
              {darkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <div style={{display:'flex',justifyContent:'space-between',alignContent:'space-between',width:"100%"}}>
          <IconButton onClick={()=>{newChat("",setButtons,buscarLogs)}}>
            <AddCommentIcon />
          </IconButton>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>

          </div>
        </DrawerHeader>
        <Divider />
        <h3>Chats</h3>
        <Divider />
        <List>
          {buttons.map((button, key) => (
            <ListItem key={key + "|" + button._id} disablePadding>
              <ListItemButton
                sx={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
                onClick={() => buscarLogs(button._id)}
              >
                <ListItemText primary={button.name} />
                <ListItemIcon>
                  <ButtonApagar id={button._id} setButtons={setButtons} />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
        <DrawerHeader />
      <Main open={open}>
        <Box
          sx={{
            display: "flex",
            flexFlow: "column",
            justifyContent: "right",
            width: "100%",
          }}
        >
          <Box>
            {messages.map((message,key) => (
              <Box
                key={key}
                sx={{
                  display: "flex",
                  width: "100%",
                  justifyContent: message.isMyMessage
                    ? "flex-end"
                    : "flex-start",
                  padding: "8px",
                  paddingLeft:"240px",
                  paddingBottom:"3em"
                }}
              >
                <Box
                  sx={{
                    backgroundColor: message.isMyMessage
                      ? "primary.main"
                      : "secondary.main",
                    color:"primary.contrastText",
                    borderRadius: "8px",
                    padding: "8px",
                    maxWidth: "60%",
                  }}
                >
                  <p>{message.message}</p>
                </Box>
              </Box>
            ))}
            <div style={{width:"100%"}} ref={messagesEndRef} />
          </Box>
          <Box
            id="chat-input"
            sx={{
              position: "fixed",
              bottom: 0,
              right: 0,
              width: open ? "calc(100% - 240px)" : "100%",
              display: "flex",
              alignItems: "center",
              padding: "8px",
              backgroundColor: "background.paper",
              boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
              zIndex: 1201,
            }}
          >
            <form
              style={{
                display: 'flex',
                width: '100%'
              }}
              onSubmit={(e) => {
                e.preventDefault();
                if (!possoMandarMensagem) {
                  return;
                }
                sendMessageToChat(selectedChat, message, messages, setMessages,setButtons,setPossoMandarMensagem);
                
                setMessage("");
              }}
            >
              <TextField
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                fullWidth
              />
              <Button type="submit">
                <SendIcon />
              </Button>
            </form>
          </Box>
        </Box>
      </Main>
    </AppProvider>
  );
}