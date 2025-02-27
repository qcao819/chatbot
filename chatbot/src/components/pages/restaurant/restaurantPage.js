import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { useAuth } from "../../../context/AuthContext";

import { addRestaurant, getRestaurants } from "../../../firebase";
import { Link, useHistory } from "react-router-dom";
import { storage } from "../../../firebase";
const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
  photo: {
    height: 200,
    width: 500,
  },

  root: {
    maxWidth: 500,
  },
  media: {
    height: 140,
  },
}));

export default function FormDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);
  const [uploadedImageUrl, setuploadedImageUrl] = useState("");
  const history = useHistory();
  const { currentUser } = useAuth();
  // const [userId, setUserId] = useState("");
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    getRestaurants().then((docs) => {
      setRestaurants(docs);
    });
  }, [open]);

  const handleAdd = () => {
    const uploadTask = storage
      .ref(`users_images/${currentUser.uid}/retaurants_images/${image.name}`)
      .put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref(`users_images/${currentUser.uid}/retaurants_images`)
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            if (url) {
              setuploadedImageUrl(url);
              console.log("restaurant image: " + url);
              if (name === "") {
                console.log("...");
              } else {
                if (addRestaurant(name, address, phone, currentUser.uid, url)) {
                  //添加成功
                  // console.log(url)
                  console.log("成功");
                  setOpen(false);
                } else {
                  console.log(console.log("添加失败！"));
                }
              }
            }
          });
      }
    );
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // const handleUpload = () => {
  //   const uploadTask = storage
  //     .ref("users images/retaurants_images/" + image.name)
  //     .put(image);
  //   uploadTask.on(
  //     "state_changed",
  //     (snapshot) => {},
  //     (error) => {
  //       console.log(error);
  //     },
  //     () => {
  //       storage
  //         .ref("image")
  //         .child(image.name)
  //         .getDownloadURL()
  //         .then((url) => {
  //           console.log(url);
  //         });
  //     }
  //   );
  // };

  console.log("image: ", image);
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Add restaurant
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Registered restaurant information
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Please enter the basic information of your restaurant
          </DialogContentText>

          <TextField
            // margin="dense"
            name="Restaurant name"
            required
            fullWidth
            multiline
            id="Restaurant name"
            label="Restaurant name"
            autoFocus
            onChange={(e) => {
              setName(e.target.value);
            }}
          />

          <TextField
            autoFocus
            required
            multiline
            margin="dense"
            name="Restaurant address"
            id="Restaurant address"
            label="Restaurant address"
            fullWidth
            onChange={(e) => {
              setAddress(e.target.value);
            }}
          />

          <TextField
            autoFocus
            margin="dense"
            name="phone number"
            id="phone number"
            label="phone number"
            type="number"
            fullWidth
            onChange={(e) => {
              setPhone(e.target.value);
            }}
          />

          <input type="file" onChange={handleChange} />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAdd} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      {restaurants.map((restaurant) => (
        <Card key={restaurant.id} className={classes.root}>
          <CardActionArea>
            <CardMedia
              className={classes.photo}
              component="img"
              alt={restaurant.name}
              //alt={firebase-image}
              height="140"
              image={restaurant.imageUrl}
              title={restaurant.name}
              onClick={() => history.push(`/restaurant/${restaurant.id}`)}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {restaurant.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {restaurant.address}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {restaurant.phonenum}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            {/* <Button size="small" color="primary" onClick={handleAddProducts}>
                add product
              </Button> */}
            <Link
              to={"/restaurant/" + restaurant.id}
              style={{ textDecoration: "none" }}
            >
              <Button size="small" color="primary" variant="outlined">
                Learn More
              </Button>
            </Link>
            <Link
              to={"/restaurant/" + restaurant.id + "/addproduct"}
              style={{ textDecoration: "none" }}
            >
              <Button size="small" color="primary" variant="outlined">
                Menu
              </Button>
            </Link>
            <Link
              to={"/restaurant/" + restaurant.id + "/order"}
              style={{ textDecoration: "none" }}
            >
              <Button size="small" color="primary" variant="outlined">
                Order
              </Button>
            </Link>
            <Link
              to={"/restaurant/" + restaurant.id + "/booking"}
              style={{ textDecoration: "none" }}
            >
              <Button size="small" color="primary" variant="outlined">
                Booking
              </Button>
            </Link>
            <Link
              to={"/restaurant/" + restaurant.id + "/chatbot"}
              style={{ textDecoration: "none" }}
            >
              <Button size="small" color="primary" variant="outlined">
                Chatbot
              </Button>
            </Link>
          </CardActions>
        </Card>
      ))}
    </div>
  );
}
