import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, CardTitle, CardBody, Col, Row, CardHeader, Card } from 'reactstrap';
import axios from 'axios';

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;
  const [newExperience, setNewExperience] = useState({
    title: '', company: '', startDate: '', endDate: '', description: ''
  });
  const [editingExperience, setEditingExperience] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState(null);
  // Fetch experience data from the backend
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/experience`);
        setExperiences(response.data);
      } catch (error) {
        console.error("Error fetching experiences", error);
      }
    };
    fetchExperiences();
  }, []);
  // Open delete confirmation modal
  const openDeleteModal = (id) => {
    setExperienceToDelete(id);
    setDeleteModalOpen(true);
  };
  // Close delete modal
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setExperienceToDelete(null);
  };

  // Delete an experience
  const deleteExperience = async () => {
    try {
      await axios.delete(`${apiUrl}/api/experience/${experienceToDelete}`);
      setExperiences(experiences.filter(exp => exp._id !== experienceToDelete));
      setExperienceToDelete(null);
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting experience", error);
    }
  };

  // Open edit modal
  const openEditModal = (exp) => {
    setEditingExperience(exp);
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setEditingExperience(null);
  };

  // Handle changes in add form
  const handleAddChange = (e) => {
    setNewExperience({ ...newExperience, [e.target.name]: e.target.value });
  };

  // Handle changes in edit form
  const handleEditChange = (e) => {
    setEditingExperience({ ...editingExperience, [e.target.name]: e.target.value });
  };

  // Submit new experience
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/experience`, newExperience);
      setExperiences([...experiences, response.data]);
      setNewExperience({ title: '', company: '', startDate: '', endDate: '', description: '' });
    } catch (error) {
      console.error("Error adding experience", error);
    }
  };

  // Submit updated experience
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedExperience = await axios.put(`http://localhost:5000/api/experience/${editingExperience._id}`, editingExperience);
      setExperiences(experiences.map(exp => (exp._id === updatedExperience.data._id ? updatedExperience.data : exp)));
      closeModal();
    } catch (error) {
      console.error("Error updating experience", error);
    }
  };

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h4">Experience Records</CardTitle>
            </CardHeader>
            <CardBody>
              <Form onSubmit={handleAddSubmit}>
                <h4>Add New Experience</h4>
                <FormGroup>
                  <Label for="title">Title</Label>
                  <Input
                    type="text"
                    name="title"
                    id="title"
                    value={newExperience.title}
                    onChange={handleAddChange}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="company">Company</Label>
                  <Input
                    type="text"
                    name="company"
                    id="company"
                    value={newExperience.company}
                    onChange={handleAddChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="startDate">Start Date</Label>
                  <Input
                    type="date"
                    name="startDate"
                    id="startDate"
                    value={newExperience.startDate}
                    onChange={handleAddChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="endDate">End Date</Label>
                  <Input
                    type="date"
                    name="endDate"
                    id="endDate"
                    value={newExperience.endDate}
                    onChange={handleAddChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="description">Description</Label>
                  <Input
                    type="textarea"
                    name="description"
                    id="description"
                    value={newExperience.description}
                    onChange={handleAddChange}
                  />
                </FormGroup>
                <Button color="primary" type="submit">Add Experience</Button>
              </Form>
            </CardBody>
          </Card>
          {/* Table of experience records */}
          <Card>
            <CardHeader>
              <CardTitle tag="h4">Experience Records</CardTitle>
            </CardHeader>
            <CardBody>
              <Table responsive>
                <thead className="text-primary">
                  <tr>
                    <th>Title</th>
                    <th>Company</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Description</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {experiences.map((exp) => (
                    <tr key={exp._id}>
                      <td>{exp.title}</td>
                      <td>{exp.company}</td>
                      <td>{exp.startDate}</td>
                      <td>{exp.endDate}</td>
                      <td>{exp.description}</td>
                      <td className="text-center">
                        <Button color="warning" className="btn-icon btn-simple" size="sm" onClick={() => openEditModal(exp)}><i className="fa fa-edit"></i></Button>
                        <Button color="danger" className="btn-icon btn-simple" size="sm" onClick={() => openDeleteModal(exp._id)}><i className="fa fa-times"></i></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Edit Modal */}
      <Modal isOpen={modalOpen} toggle={closeModal}>
        <ModalHeader toggle={closeModal}>Edit Experience</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleEditSubmit}>
            <FormGroup>
              <Label for="title">Title</Label>
              <Input
                type="text"
                name="title"
                id="title"
                style={{ color: 'black' }}
                value={editingExperience?.title || ''}
                onChange={handleEditChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="company">Company</Label>
              <Input
                type="text"
                name="company"
                id="company"
                style={{ color: 'black' }}
                value={editingExperience?.company || ''}
                onChange={handleEditChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="startDate">Start Date</Label>
              <Input
                type="date"
                name="startDate"
                id="startDate"
                style={{ color: 'black' }}
                value={editingExperience?.startDate || ''}
                onChange={handleEditChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="endDate">End Date</Label>
              <Input
                type="date"
                name="endDate"
                id="endDate"
                style={{ color: 'black' }}
                value={editingExperience?.endDate || ''}
                onChange={handleEditChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="textarea"
                name="description"
                id="description"
                style={{ color: 'black' }}
                value={editingExperience?.description || ''}
                onChange={handleEditChange}
              />
            </FormGroup>
            <Button color="primary" type="submit">Save Changes</Button>
          </Form>
        </ModalBody>
      </Modal>
      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModalOpen} toggle={closeDeleteModal}>
        <ModalHeader toggle={closeDeleteModal}>Delete Confirmation</ModalHeader>
        <ModalBody>
          <p>Are you sure you want to delete this experience?</p>
          <Button color="danger" onClick={deleteExperience}>Yes, Delete</Button>{' '}
          <Button color="secondary" onClick={closeDeleteModal}>Cancel</Button>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default Experience;
