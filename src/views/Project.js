import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, CardTitle, CardBody, Col, Row, CardHeader, Card, Input } from 'reactstrap';
import axios from 'axios';

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    title: '', category: '', clientName: '', Date: '', description: '', details: '', moreDetails: '', images: []
  });
  
  const [editingProject, setEditingProject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Load projects data from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/projects');
        setProjects(response.data);
      } catch (error) {
        console.error("Error loading projects data", error);
      }
    };
    fetchProjects();
  }, []);

  // Delete a project
  const deleteProject = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/projects/${id}`);
      setProjects(projects.filter(item => item._id !== id));
    } catch (error) {
      console.error("Error deleting project", error);
    }
  };

  // Open the edit modal
  const openEditModal = (project) => {
    setEditingProject({ ...project, images: [] });
    setModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setModalOpen(false);
    setEditingProject(null);
  };

  // Handle input change in the add form
  const handleAddChange = (e) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  // Handle input change in the edit form
  const handleEditChange = (e) => {
    setEditingProject({ ...editingProject, [e.target.name]: e.target.value });
  };

  // Handle multiple image selection for add form
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewProject(prevState => ({
      ...prevState,
      images: [...prevState.images, ...files]  // Append new files to the existing images array
    }));
  };

  // Handle multiple image selection for edit form
  const handleEditImageChange = (e) => {
    const files = Array.from(e.target.files);
    setEditingProject(prevState => ({
      ...prevState,
      images: [...(prevState.images || []), ...files]  // Append to the existing array for edit
    }));
  };

  // Add a new project
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newProject.title);
    formData.append('category', newProject.category);
    formData.append('clientName', newProject.clientName);
    formData.append('Date', newProject.Date);
    formData.append('description', newProject.description);
    formData.append('details', newProject.details);
    formData.append('moreDetails', newProject.moreDetails);
  
    // Append each image separately
    newProject.images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      const response = await axios.post('http://localhost:5000/api/projects', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProjects([...projects, response.data]);
      setNewProject({
        title: '', category: '', clientName: '', Date: '', description: '', details: '', moreDetails: '', images: []
      });
    } catch (error) {
      console.error("Error adding project", error);
    }
  };

  // Update a project
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', editingProject.title);
    formData.append('category', editingProject.category);
    formData.append('clientName', editingProject.clientName);
    formData.append('Date', editingProject.Date);
    formData.append('description', editingProject.description);
    formData.append('details', editingProject.details);
    formData.append('moreDetails', editingProject.moreDetails);

    // Append each new image separately
    editingProject.images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      const response = await axios.put(`http://localhost:5000/api/projects/${editingProject._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProjects(projects.map(item => (item._id === response.data._id ? response.data : item)));
      closeModal();
    } catch (error) {
      console.error("Error updating project", error);
    }
  };

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h4">Project Records</CardTitle>
            </CardHeader>
            <CardBody>
              {/* Add Project Form */}
              <Form onSubmit={handleAddSubmit}>
                <h4>Add New Project</h4>
                <FormGroup>
                  <Label for="title">Title</Label>
                  <Input type="text" name="title" id="title" value={newProject.title} onChange={handleAddChange} required />
                </FormGroup>
                <FormGroup>
                  <Label for="category">Category</Label>
                  <Input type="text" name="category" id="category" value={newProject.category} onChange={handleAddChange} />
                </FormGroup>
                <FormGroup>
                  <Label for="clientName">Client Name</Label>
                  <Input type="text" name="clientName" id="clientName" value={newProject.clientName} onChange={handleAddChange} />
                </FormGroup>
                <FormGroup>
                  <Label for="Date">Start Date</Label>
                  <Input type="date" name="Date" id="Date" value={newProject.Date} onChange={handleAddChange} />
                </FormGroup>
                <FormGroup>
                  <Label for="description">Description</Label>
                  <Input type="textarea" name="description" id="description" value={newProject.description} onChange={handleAddChange} />
                </FormGroup>
                <FormGroup>
                  <Label for="details">Details</Label>
                  <Input type="textarea" name="details" id="details" value={newProject.details} onChange={handleAddChange} />
                </FormGroup>
                <FormGroup>
                  <Label for="moredetails">More details</Label>
                  <Input type="textarea" name="moredetails" id="moredetails" value={newProject.moreDetails} onChange={handleAddChange} />
                </FormGroup>
                
                <FormGroup>
                  <Label for="images">Upload Images</Label>
                  <Input
                    type="file"
                    name="images"
                    id="images"
                    multiple
                    onChange={handleImageChange}
                  />
                </FormGroup>
                <Button color="primary" type="submit">Add Project</Button>
              </Form>
            </CardBody>
          </Card>

          {/* Projects Table */}
          <Card>
            <CardHeader>
              <CardTitle tag="h4">Project Records</CardTitle>
            </CardHeader>
            <CardBody>
              <Table className="tablesorter" responsive>
                <thead className="text-primary">
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Client Name</th>
                    <th>Start Date</th>
                    <th>Description</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project._id}>
                      <td>{project.title}</td>
                      <td>{project.category}</td>
                      <td>{project.clientName}</td>
                      <td>{project.Date}</td>
                      <td>{project.description}</td>
                      <td className="text-center">
                        <Button color="warning" size="sm" onClick={() => openEditModal(project)}><i className="fa fa-edit"></i></Button>
                        <Button color="danger" size="sm" onClick={() => deleteProject(project._id)}><i className="fa fa-times"></i></Button>
                        {project.images && project.images.map((image, index) => (
                          <img key={index} src={`http://localhost:5000${image}`} alt={`Project ${project.title} image`} width="50" height="50" />
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Edit Project Modal */}
      <Modal isOpen={modalOpen} toggle={closeModal}>
        <ModalHeader toggle={closeModal}>Edit Project</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleEditSubmit}>
            <FormGroup>
              <Label for="title">Title</Label>
              <Input
                type="text"
                name="title"
                id="title"
                style={{ color: 'black' }}
                value={editingProject?.title || ''}
                onChange={handleEditChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="title">Title</Label>
              <Input type="text" name="title" id="title"  style={{ color: 'black' }}value={editingProject?.title || ''} onChange={handleEditChange} required />
            </FormGroup>
            <FormGroup>
              <Label for="category">Category</Label>
              <Input type="text" name="category" id="category"  style={{ color: 'black' }}value={editingProject?.category || ''} onChange={handleEditChange} />
            </FormGroup>
            <FormGroup>
              <Label for="clientName">Client Name</Label>
              <Input type="text" name="clientName" id="clientName"  style={{ color: 'black' }}value={editingProject?.clientName || ''} onChange={handleEditChange} />
            </FormGroup>
            <FormGroup>
              <Label for="Date">Date</Label>
              <Input type="date" name="Date" id="Date" style={{ color: 'black' }} value={editingProject?.Date || ''} onChange={handleEditChange} />
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input type="textarea" name="description" id="description"  style={{ color: 'black' }}value={editingProject?.description || ''} onChange={handleEditChange} />
            </FormGroup>
            <FormGroup>
              <Label for="details">Details</Label>
              <Input type="textarea" name="details" id="details" style={{ color: 'black' }} value={editingProject?.details || ''} onChange={handleEditChange} />
            </FormGroup>
            <FormGroup>
              <Label for="moredetails">More Details</Label>
              <Input type="textarea" name="moredetails" id="moredetails"style={{ color: 'black' }} value={editingProject?.moreDetails || ''} onChange={handleEditChange} />
            </FormGroup>
            <FormGroup>
              <Label for="images">Upload Images</Label>
              <Input
                type="file"
                name="images"
                id="images"
                multiple
                onChange={handleEditImageChange}
              />
            </FormGroup>
            <Button color="primary" type="submit">Save Changes</Button>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default Project;
