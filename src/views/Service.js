import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';

const Services = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ name: '', icon: '', description: '', price: '' });
  const [editingService, setEditingService] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;

  // Fetch services from the backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/services`);
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  // Handle delete
  const deleteService = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/services/${id}`);
      setServices(services.filter(service => service._id !== id));
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  // Open and close modal for edit
  const openEditModal = (service) => {
    setEditingService(service);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingService(null);
  };

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingService) {
      setEditingService({ ...editingService, [name]: value });
    } else {
      setNewService({ ...newService, [name]: value });
    }
  };

  // Handle add new service
  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/services`, newService);
      setServices([...services, response.data]);
      setNewService({ name: '', icon: '', description: '', price: '' });
    } catch (error) {
      console.error("Error adding service:", error);
    }
  };

  // Handle edit service
  const handleEditService = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${apiUrl}/api/services/${editingService._id}`, editingService);
      setServices(services.map(service => (service._id === response.data._id ? response.data : service)));
      closeModal();
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  return (
    <div className="content">
      <h2>Manage Services</h2>
      <Form onSubmit={handleAddService} className="mb-4">
        <h4>Add New Service</h4>
        <FormGroup>
          <Label for="name">Name</Label>
          <Input
            type="text"
            name="name"
            id="name"
            value={newService.name}
            onChange={handleInputChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="icon">Icon URL</Label>
          <Input
            type="text"
            name="icon"
            id="icon"
            value={newService.icon}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="description">Description</Label>
          <Input
            type="textarea"
            name="description"
            id="description"
            value={newService.description}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="price">Price</Label>
          <Input
            type="number"
            name="price"
            id="price"
            value={newService.price}
            onChange={handleInputChange}
          />
        </FormGroup>
        <Button color="primary" type="submit">Add Service</Button>
      </Form>

      <Table responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Icon</th>
            <th>Description</th>
            <th>Price</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map(service => (
            <tr key={service._id}>
              <td>{service.name}</td>
              <td><img src={service.icon} alt="icon" style={{ width: 50, height: 50 }} /></td>
              <td>{service.description}</td>
              <td>${service.price}</td>
              <td className="text-center">
                <Button color="warning" size="sm" onClick={() => openEditModal(service)}>
                  <i className="fa fa-edit"></i>
                </Button>
                <Button color="danger" size="sm" onClick={() => deleteService(service._id)}>
                  <i className="fa fa-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal isOpen={modalOpen} toggle={closeModal}>
        <ModalHeader toggle={closeModal}>Edit Service</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleEditService}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                type="text"
                name="name"
                id="name"
                style={{ color: 'black' }}
                value={editingService?.name || ''}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="icon">Icon URL</Label>
              <Input
                type="text"
                name="icon"
                id="icon"
                style={{ color: 'black' }}
                value={editingService?.icon || ''}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="textarea"
                name="description"
                id="description"
                style={{ color: 'black' }}
                value={editingService?.description || ''}
                onChange={handleInputChange}
              />
            </FormGroup>
            
            <Button color="primary" type="submit">Save Changes</Button>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default Services;
