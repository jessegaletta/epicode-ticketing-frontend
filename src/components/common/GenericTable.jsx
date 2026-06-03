import { useState, useEffect } from "react";
import { Table, Button, Form, InputGroup, Pagination, Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { formatDateTime } from "../../utils/dateUtils";

const GenericTable = ({
  columns,
  data = [],
  loading = false,
  error = null,
  totalPages = 1,
  onFetchData,
  detailsUrlPrefix,
  initialState = {},
}) => {
  const [page, setPage] = useState(initialState.page || 0);
  const [searchInput, setSearchInput] = useState(initialState.search || "");
  const [searchTerm, setSearchTerm] = useState(initialState.search || "");
  const [sortField, setSortField] = useState(initialState.sortBy || "id");
  const [sortDir, setSortDir] = useState(initialState.sortDir || "ASC");
  const navigate = useNavigate();

  const settings = useSelector((state) => state.settings);

  useEffect(() => {
    if (error && (error.toLowerCase().includes("access denied") || error.includes("403"))) {
      navigate("/access-denied");
    }
  }, [error, navigate]);

  useEffect(() => {
    if (onFetchData) {
      onFetchData({ page, search: searchTerm, sortBy: sortField, sortDir });
    }
  }, [page, searchTerm, sortField, sortDir]);

  const handleSearch = () => {
    setPage(0);
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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === "ASC" ? "DESC" : "ASC");
    } else {
      setSortField(field);
      setSortDir("ASC");
    }
    setPage(0);
  };

  const handleOpen = (item) => {
    navigate(`/${detailsUrlPrefix}/${item.id}`, { state: { editMode: !!item.isEditable } });
  };

  return (
    <Container className="my-4 flex-grow-1">
      <Row className="mb-3 align-items-center flex-nowrap g-2">
        <Col style={{ minWidth: 0 }}>
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
        <Col xs="auto">
          <Button variant="success" onClick={handleNew}>
            <i className="bi bi-plus"></i> <span className="d-none d-sm-inline">New</span>
          </Button>
        </Col>
      </Row>

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
                {columns.map((col, index) => {
                  const currentSortField = col.sortField || col.field;
                  return (
                    <th
                      key={index}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSort(currentSortField)}
                      className="text-nowrap"
                    >
                      {col.label}
                      {sortField === currentSortField && (
                        <i className={`bi bi-caret-${sortDir === "ASC" ? "up" : "down"}-fill ms-1`}></i>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-4">
                    No records found.
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => handleOpen(item)}
                    style={{ cursor: "pointer" }}
                    className="table-row-clickable"
                  >
                    {columns.map((col, index) => (
                      <td key={index} className="align-middle text-nowrap">
                        {col.isDate ? formatDateTime(item[col.field], settings) : item[col.field]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          {totalPages > 1 && (
            <div className="d-flex justify-content-center">
              <Pagination>
                <Pagination.First onClick={() => setPage(0)} disabled={page === 0} />
                <Pagination.Prev onClick={() => setPage(page - 1)} disabled={page === 0} />
                {/* [...Array(n).keys()] is a quick way to generate an array [0, 1, 2, ..., n-1] */}
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
    </Container>
  );
};

export default GenericTable;
