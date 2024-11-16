import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, CardTitle, CardBody, Col, Row, CardHeader, Card, Input } from 'reactstrap';
import axios from 'axios';

const Education = () => {
  const [education, setEducation] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;
  const [newEducation, setNewEducation] = useState({
    title: '', institution: '', startDate: '', endDate: '', description: '', certificateImage: null
  });
  const [editingEducation, setEditingEducation] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  // New state for delete confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [educationToDelete, setEducationToDelete] = useState(null);

  // Charger les données d'éducation depuis le backend
  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/education`);
        setEducation(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des données d'éducation", error);
      }
    };
    fetchEducation();
  }, []);

  // Open confirmation modal
  const openDeleteModal = (edu) => {
    setEducationToDelete(edu);
    setDeleteModalOpen(true);
  };

  // Close confirmation modal
  const closeDeleteModal = () => {
    setEducationToDelete(null);
    setDeleteModalOpen(false);
  };

  // Supprimer un enregistrement d'éducation
  const confirmDeleteEducation = async () => {
    if (!educationToDelete) return;
    try {
      await axios.delete(`${apiUrl}/api/education/${educationToDelete._id}`);
      setEducation(education.filter(item => item._id !== educationToDelete._id));
      closeDeleteModal();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'éducation", error);
    }
  };


  // Ouvrir le modal d'édition
  const openEditModal = (edu) => {
    setEditingEducation(edu);
    setModalOpen(true);
  };

  // Fermer le modal
  const closeModal = () => {
    setModalOpen(false);
    setEditingEducation(null);
  };

  // Gérer les changements dans le formulaire d'ajout
  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewEducation({
      ...newEducation,
      [name]: value
    });
  };

  // Gérer les changements dans le formulaire d'édition
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingEducation({
      ...editingEducation,
      [name]: value
    });
  };

  // Gérer le changement de fichier image dans le formulaire d'ajout
  const handleAddFileChange = (e) => {
    setNewEducation({
      ...newEducation,
      certificateImage: e.target.files[0]  // Store the file object
    });
  };

  // Gérer le changement de fichier image dans le formulaire d'édition
  const handleEditFileChange = (e) => {
    setEditingEducation({
      ...editingEducation,
      certificateImage: e.target.files[0]  // Store the file object
    });
  };

  // Ajouter un nouvel enregistrement d'éducation
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newEducation.title);
    formData.append('institution', newEducation.institution);
    formData.append('startDate', newEducation.startDate);
    formData.append('endDate', newEducation.endDate);
    formData.append('description', newEducation.description);
    formData.append('certificateImage', newEducation.certificateImage); // Append file here

    try {
      const response = await axios.post(`${apiUrl}/api/education`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',  // Set content type to multipart for file upload
        },
      });
      setEducation([...education, response.data]);
      setNewEducation({ title: '', institution: '', startDate: '', endDate: '', description: '', certificateImage: null });
    }catch (error) {
      console.error('Error occurred while adding education:', error);
      if (error.response) {
        console.log('Response error:', error.response);
      } else if (error.request) {
        console.log('Request error:', error.request);
      } else {
        console.log('General error:', error.message);
      }
    }
  };

  // Mettre à jour un enregistrement d'éducation
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', editingEducation.title);
    formData.append('institution', editingEducation.institution);
    formData.append('startDate', editingEducation.startDate);
    formData.append('endDate', editingEducation.endDate);
    formData.append('description', editingEducation.description);
    if (editingEducation.certificateImage) {
      formData.append('certificateImage', editingEducation.certificateImage); // Append file if changed
    }

    try {
      const updatedEducation = await axios.put(`${apiUrl}/api/education/${editingEducation._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',  // Set content type to multipart for file upload
        },
      });
      setEducation(education.map(item => (item._id === updatedEducation.data._id ? updatedEducation.data : item)));
      closeModal();
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'éducation", error);
    }
  };

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h4">Education Records</CardTitle>
            </CardHeader>
            <CardBody>
              {/* Formulaire d'ajout d'éducation */}
              <Form onSubmit={handleAddSubmit}>
                <h4>Add New Education</h4>
                <FormGroup>
                  <Label for="title">Title</Label>
                  <Input
                    type="text"
                    name="title"
                    id="title"
                    value={newEducation.title}
                    onChange={handleAddChange}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="institution">Institution</Label>
                  <Input
                    type="text"
                    name="institution"
                    id="institution"
                    value={newEducation.institution}
                    onChange={handleAddChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="startDate">Start Date</Label>
                  <Input
                    type="date"
                    name="startDate"
                    id="startDate"
                    value={newEducation.startDate}
                    onChange={handleAddChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="endDate">End Date</Label>
                  <Input
                    type="date"
                    name="endDate"
                    id="endDate"
                    value={newEducation.endDate}
                    onChange={handleAddChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="description">Description</Label>
                  <Input
                    type="textarea"
                    name="description"
                    id="description"
                    value={newEducation.description}
                    onChange={handleAddChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="certificateImage">Certificate Image</Label>
                  <Input
                    type="file"
                    name="certificateImage"
                    id="certificateImage"
                    onChange={handleAddFileChange}
                  />
                </FormGroup>
                <Button color="primary" type="submit">Add Education</Button>
              </Form>
            </CardBody>
          </Card>
          {/* Table des enregistrements d'éducation */}
          <Card>
            <CardHeader>
              <CardTitle tag="h4">Education Records</CardTitle>
            </CardHeader>
            <CardBody>
              <Table className="tablesorter" responsive>
                <thead className="text-primary">
                  <tr>
                    <th>Title</th>
                    <th>Institution</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Description</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {education.map((edu) => (
                    <tr key={edu._id}>
                      <td>{edu.title}</td>
                      <td>{edu.institution}</td>
                      <td>{edu.startDate}</td>
                      <td>{edu.endDate}</td>
                      <td>{edu.description}</td>
                      <td className="text-center">
                        <Button color="warning"  className="btn-icon btn-simple"size="sm" onClick={() => openEditModal(edu)}><i className="fa fa-edit"></i></Button>
                        <Button color="danger" size="sm" onClick={() => openDeleteModal(edu)}>
                    <i className="fa fa-times"></i>
                  </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModalOpen} toggle={closeDeleteModal}>
        <ModalHeader toggle={closeDeleteModal}>Confirm Delete</ModalHeader>
        <ModalBody>
          Are you sure you want to delete the education record "{educationToDelete?.title}"?
        </ModalBody>
        <div className="modal-footer">
          <Button color="secondary" onClick={closeDeleteModal}>
            Cancel
          </Button>
          <Button color="danger" onClick={confirmDeleteEducation}>
            Delete
          </Button>
        </div>
      </Modal>

      {/* Modal d'édition */}
      <Modal isOpen={modalOpen} toggle={closeModal}>
        <ModalHeader toggle={closeModal}>Edit Education</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleEditSubmit}>
            <FormGroup>
              <Label for="title">Title</Label>
              <Input
                type="text"
                name="title"
                id="title"
                style={{ color: 'black' }}
                value={editingEducation?.title || ''}
                onChange={handleEditChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="institution">Institution</Label>
              <Input
                type="text"
                name="institution"
                id="institution"
                style={{ color: 'black' }}
                value={editingEducation?.institution || ''}
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
                value={editingEducation?.startDate || ''}
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
                value={editingEducation?.endDate || ''}
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
                value={editingEducation?.description || ''}
                onChange={handleEditChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="certificateImage">Certificate Image</Label>
              <Input
                type="file"
                name="certificateImage"
                id="certificateImage"
                onChange={handleEditFileChange}
              />
            </FormGroup>
            <Button color="primary" type="submit">Save Changes</Button>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default Education;
