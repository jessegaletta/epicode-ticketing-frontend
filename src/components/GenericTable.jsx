import { useState, useEffect } from "react";
import { Table, Button, Form, InputGroup, Pagination, Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router";
import ConfirmModal from "./ConfirmModal";

const GenericTable = ({
  columns,
  data = [],
  loading = false,
  error = null,
  totalPages = 1,
  onFetchData,
  onDelete,
  detailsUrlPrefix
}) => {
  const [page, setPage] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const navigate = useNavigate();

  // Handle access denied redirect
  useEffect(() => {
    if (error && (error.toLowerCase().includes("access denied") || error.includes("403"))) {
      navigate("/access-denied");
    }
  }, [error, navigate]);

  // Fetch data whenever page or searchTerm changes
  useEffect(() => {
    if (onFetchData) {
      onFetchData({ page, search: searchTerm });
    }
  }, [page, searchTerm]); 

  const handleSearch = () => {
    setPage(0); // Reset to first page on new search
    setSearchTerm(searchInput);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleNew = () => {
    navigate(`/${detailsUrlPrefix}/new`);
  };

  const handleOpen = (item) => {
    navigate(`/${detailsUrlPrefix}/${item.id}`, { state: { editMode: !!item.isEditable } });
  };

  const handleDelete = (id) => {
    setRecordToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete && recordToDelete) {
      onDelete(recordToDelete);
    }
    setShowDeleteModal(false);
    setRecordToDelete(null);
  };

  return (
    <Container className="my-4 flex-grow-1">
      {/* Top Toolbar */}
      <Row className="mb-3">
        <Col xs={12} md={6} className="mb-2 mb-md-0">
          <InputGroup>
            <Form.Control
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button variant="outline-secondary" onClick={handleSearch}>
              <i className="bi bi-search"></i>
            </Button>
          </InputGroup>
        </Col>
        <Col xs={12} md={6} className="text-md-end">
          <Button variant="success" onClick={handleNew}>
            <i className="bi bi-plus"></i> New
          </Button>
        </Col>
      </Row>

      {/* Main Content Area */}
      {error && !error.toLowerCase().includes("access denied") && (
        <Alert variant="danger">{error}</Alert>
      )}

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <Table responsive striped hover className="mb-4">
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={index}>{col.label}</th>
                ))}
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center py-4">
                    No records found.
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id}>
                    {columns.map((col, index) => (
                      <td key={index} className="align-middle">
                        {/* Nested properties can be accessed if field is e.g. "user.name" */}
                        {item[col.field]}
                      </td>
                    ))}
                    <td className="text-end align-middle text-nowrap">
                      {/* Conditionally render edit or view button based on isEditable */}
                      <Button
                        variant={item.isEditable ? "outline-warning" : "outline-info"}
                        size="sm"
                        className="me-2"
                        onClick={() => handleOpen(item)}
                        title={item.isEditable ? "Open (Edit)" : "Open (View)"}
                      >
                        <i className="bi bi-box-arrow-up-right"></i>
                      </Button>

                      {/* Conditionally render Delete if isEditable is true */}
                      {item.isEditable && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          title="Delete"
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center">
              <Pagination>
                <Pagination.First onClick={() => setPage(0)} disabled={page === 0} />
                <Pagination.Prev onClick={() => setPage(page - 1)} disabled={page === 0} />
                
                {/* Simple page numbers mapping */}
                {[...Array(totalPages).keys()].map((pageNum) => (
                  <Pagination.Item
                    key={pageNum}
                    active={pageNum === page}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum + 1}
                  </Pagination.Item>
                ))}

                <Pagination.Next onClick={() => setPage(page + 1)} disabled={page === totalPages - 1} />
                <Pagination.Last onClick={() => setPage(totalPages - 1)} disabled={page === totalPages - 1} />
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this record? This action cannot be undone."
        confirmText="Delete"
        confirmVariant="danger"
      />
    </Container>
  );
};

export default GenericTable;
