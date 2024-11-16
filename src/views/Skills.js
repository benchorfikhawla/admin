import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, CardTitle,CardBody,  Col, Row,CardHeader,Card,Input } from 'reactstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';

 
import axios from 'axios';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ name: '', icon: '', level: '' });
  const [editingSkill, setEditingSkill] = useState(null); // Pour l'édition d'une compétence
  const [modalOpen, setModalOpen] = useState(false); // Pour l'ouverture du modal d'édition
  const apiUrl = process.env.REACT_APP_API_URL;

  // Charger les compétences depuis le backend
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/skills`);
        setSkills(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des compétences", error);
      }
    };
    fetchSkills();
  }, []);

  // Supprimer une compétence
  const deleteSkill = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/skills/${id}`);
      setSkills(skills.filter(skill => skill._id !== id)); // Met à jour la liste des compétences
    } catch (error) {
      console.error("Erreur lors de la suppression de la compétence", error);
    }
  };

  // Ouvrir le modal d'édition
  const openEditModal = (skill) => {
    setEditingSkill(skill);  // Remplir les informations de la compétence à éditer
    setModalOpen(true);
  };

  // Fermer le modal
  const closeModal = () => {
    setModalOpen(false);
    setEditingSkill(null); // Réinitialiser l'état de la compétence en cours d'édition
  };

  // Gérer le changement dans le formulaire d'édition
  const handleEditChange = (e) => {
    setEditingSkill({ ...editingSkill, [e.target.name]: e.target.value });
  };

  // Gérer le changement dans le formulaire d'ajout
  const handleAddChange = (e) => {
    setNewSkill({ ...newSkill, [e.target.name]: e.target.value });
  };

  // Ajouter une nouvelle compétence
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/skills`, newSkill);
      setSkills([...skills, response.data]);
      setNewSkill({ name: '', icon: '', level: '' }); // Réinitialiser le formulaire d'ajout
    } catch (error) {
      console.error("Erreur lors de l'ajout de la compétence", error);
    }
  };

  // Mettre à jour une compétence
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedSkill = await axios.put(`${apiUrl}/api/skills/${editingSkill._id}`, editingSkill);
      setSkills(skills.map(skill => (skill._id === updatedSkill.data._id ? updatedSkill.data : skill)));
      closeModal(); // Fermer le modal après la mise à jour
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la compétence", error);
    }
  };

  return (
    
 <div className="content">
    <Row>
    <Col md="12">
      <Card>
            <CardHeader>
                <CardTitle tag="h4">Simple Table</CardTitle>
            </CardHeader>
            <CardBody>
     <Col md="12">
     <Form onSubmit={handleAddSubmit}>
        <h4>Add New Skill</h4>
        <FormGroup>
          <Label for="name">Name</Label>
          <Input
            type="text"
            name="name"
            id="name"
            value={newSkill.name}
            onChange={handleAddChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="icon">Icon</Label>
          <Input
            type="text"
            name="icon"
            id="icon"
            value={newSkill.icon}
            onChange={handleAddChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="level">Level</Label>
          <Input
            type="text"
            name="level"
            id="level"
            value={newSkill.level}
            onChange={handleAddChange}
            required
          />
        </FormGroup>
        <Button color="primary" type="submit">Add Skill</Button>
      </Form>
      </Col>
       </CardBody>
        </Card>
      <Card>
            <CardHeader>
                <CardTitle tag="h4">Simple Table</CardTitle>
            </CardHeader>
            <CardBody>
      {/* Tableau des compétences */}
      <Table className="tablesorter" responsive>
        <thead className="text-primary">
          <tr>
            <th>Name</th>
            <th>Icon</th>
            <th>Level</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {skills.map(skill => (
            <tr key={skill._id}>
              <td>{skill.name}</td>
              <td>{skill.icon}</td>
              <td>{skill.level}</td>
              <td className="text-center">
                <Button  className="btn-icon btn-simple" color="warning"  size="sm" onClick={() => openEditModal(skill)}><i className="fas fa-pencil-alt"></i></Button>{` `}
                <Button  className="btn-icon btn-simple" color="danger" size="sm"  onClick={() => deleteSkill(skill._id)}><i className="fas fa-trash"></i></Button>{` `}
              </td>
            </tr>
          ))}
        </tbody>
        
      </Table>
      </CardBody>
      </Card>
          </Col>
           
      
      {/* Formulaire d'ajout de compétence */}
      
       
      {/* Modal d'édition */}
      <Modal isOpen={modalOpen} toggle={closeModal}>
        <ModalHeader toggle={closeModal}>Edit Skill</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleEditSubmit}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={editingSkill?.name || ''}
                style={{ color: 'black' }}
                onChange={handleEditChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="icon">Icon</Label>
              <Input
                type="text"
                name="icon"
                id="icon"
                style={{ color: 'black' }}
                value={editingSkill?.icon || ''}
                onChange={handleEditChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="level">Level</Label>
              <Input
                type="text"
                name="level"
                id="level"
                style={{ color: 'black' }}
                value={editingSkill?.level || ''}
                onChange={handleEditChange}
                required
              />
            </FormGroup>
            <Button color="primary" type="submit">Save Changes</Button>
          </Form>
        </ModalBody>
      </Modal>
       </Row>
    </div>
  );
};

export default Skills;
