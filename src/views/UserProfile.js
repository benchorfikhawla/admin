import React, { useEffect, useState } from "react";
import { useUser } from "contexts/UserContext";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  FormGroup,
  Form,
  Input,
  Row,
  Col
} from "reactstrap";
import axios from "axios";

function UserProfile() {
  const { userEmail } = useUser();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [user, setUser] = useState({
    _id: "", // Added user ID to keep track
    name: "",
    profession: "",
    bio: "",
    biohome: "",
    email: "",
    tel: "",
    description: "",
    image: "",
    imageprofile: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imageProfileFile, setImageProfileFile] = useState(null);

   

  useEffect(() => {
    // Fetch user profile data by email when the component mounts
    axios
      .get(`${apiUrl}/api/users/profile?email=${userEmail}`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });
  },[userEmail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleImageProfileChange = (e) => {
    setImageProfileFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Append user details
    formData.append("name", user.name);
    formData.append("profession", user.profession);
    formData.append("bio", user.bio);
    formData.append("biohome", user.biohome);
    formData.append("description", user.description);
    formData.append("email", user.email);

    // Append files if they exist
    if (imageFile) {
      formData.append("image", imageFile);
    }

    if (imageProfileFile) {
      formData.append("imageprofile", imageProfileFile);
    }

    // Use the user ID in the URL for the PUT request
    axios
      .put(`${apiUrl}/api/users/profile/${user._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        alert("Profile updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  return (
    <div className="content">
      <Row>
        <Col md="8">
          <Card>
            <CardHeader>
              <h5 className="title">Edit Profile</h5>
            </CardHeader>
            <CardBody>
              <Form onSubmit={handleSubmit}>
                <Row>
                  
                  <Col className="px-md-1" md="6">
                    <FormGroup>
                      <label>Username</label>
                      <Input
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        placeholder="Username"
                        type="text"
                      />
                    </FormGroup>
                  </Col>
                  <Col className="pl-md-1" md="6">
                    <FormGroup>
                      <label htmlFor="exampleInputEmail1">Email address</label>
                      <Input
                        disabled
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        placeholder="Email"
                        type="email"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col className="pr-md-1" md="6">
                    <FormGroup>
                      <label>First Name</label>
                      <Input
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        placeholder="First Name"
                        type="text"
                      />
                    </FormGroup>
                  </Col>
                  <Col className="pl-md-1" md="6">
                    <FormGroup>
                      <label>Profession</label>
                      <Input
                        name="profession"
                        value={user.profession}
                        onChange={handleChange}
                        placeholder="Profession"
                        type="text"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="12">
                    <FormGroup>
                      <label>About Me</label>
                      <Input
                        name="bio"
                        value={user.bio}
                        onChange={handleChange}
                        cols="80"
                        placeholder="Brief bio about yourself"
                        rows="4"
                        type="textarea"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="12">
                    <FormGroup>
                      <label>Homepage Bio</label>
                      <Input
                        name="biohome"
                        value={user.biohome}
                        onChange={handleChange}
                        cols="80"
                        placeholder="Bio for the homepage"
                        rows="4"
                        type="textarea"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="12">
                    <FormGroup>
                      <label>Description</label>
                      <Input
                        name="description"
                        value={user.description}
                        onChange={handleChange}
                        cols="80"
                        placeholder="Additional description"
                        rows="4"
                        type="textarea"
                      />
                    </FormGroup>
                  </Col>
                </Row>

                {/* Image Upload */}
                <Row>
                  <Col md="12">
                    <FormGroup>
                      <label>Profile Image</label>
                      <Input
                        type="file"
                        onChange={handleImageProfileChange}
                        accept="image/*"
                      />
                    </FormGroup>
                  </Col>
                </Row>

                {/* Image Upload */}
                <Row>
                  <Col md="12">
                    <FormGroup>
                      <label>Upload Image</label>
                      <Input
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <CardFooter>
                  <Button className="btn-fill" color="primary" type="submit">
                    Save
                  </Button>
                </CardFooter>
              </Form>
            </CardBody>
          </Card>
        </Col>
        <Col md="4">
          <Card className="card-user">
            <CardBody>
              <div className="author">
                <a href="#pablo" onClick={(e) => e.preventDefault()}>
                  <img
                    alt="Profile"
                    className="avatar"
                    src={`${apiUrl}${user.imageprofile}` || "default-image.jpg"} // Fallback image if not available
                  />
                  <h5 className="title">{user.name}</h5>
                </a>
                <p className="description">{user.profession}</p>
              </div>
              <div className="card-description">{user.description}</div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default UserProfile;
