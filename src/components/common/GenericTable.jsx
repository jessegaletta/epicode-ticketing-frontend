import { useState, useEffect } from "react";
import { Table, Button, Form, InputGroup, Pagination, Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const GenericTable = ({
  columns,
  data = [],
  loading = false,
  error = null,
  totalPages = 1,
  onFetchData,
  detailsUrlPrefix
}) => {
  const [page, setPage] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDir, setSortDir] = useState("ASC");
  const navigate = useNavigate();

  const settings = useSelector((state) => state.settings);

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;

    const tz = settings?.timezone || "UTC";
    const dateFormat = settings?.dateFormat || "DD/MM/YYYY";
    const timeFormat = settings?.timeFormat || "24h";

    try {
      const optionsDate = { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" };
      const optionsTime = { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: timeFormat === "12h" };

      const parts = new Intl.DateTimeFormat("en-US", optionsDate).formatToParts(date);
      const m = parts.find(p => p.type === "month").value;
      const d = parts.find(p => p.type === "day").value;
      const y = parts.find(p => p.type === "year").value;
      
      let formattedDate = "";
      if (dateFormat === "DD/MM/YYYY") formattedDate = `${d}/${m}/${y}`;
      else if (dateFormat === "MM/DD/YYYY") formattedDate = `${m}/${d}/${y}`;
      else if (dateFormat === "YYYY-MM-DD") formattedDate = `${y}-${m}-${d}`;

      const formattedTime = new Intl.DateTimeFormat("en-US", optionsTime).format(date);
      return `${formattedDate} ${formattedTime}`;
    } catch (e) {
      return dateString;
    }
  };

  // Handle access denied redirect
  useEffect(() => {
    if (error && (error.toLowerCase().includes("access denied") || error.includes("403"))) {
      navigate("/access-denied");
    }
  }, [error, navigate]);

  // Fetch data whenever page, searchTerm, or sorting changes
  useEffect(() => {
    if (onFetchData) {
      onFetchData({ page, search: searchTerm, sortBy: sortField, sortDir });
    }
  }, [page, searchTerm, sortField, sortDir]); 

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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === "ASC" ? "DESC" : "ASC");
    } else {
      setSortField(field);
      setSortDir("ASC");
    }
    setPage(0); // Reset to first page on sort change
  };

  const handleOpen = (item) => {
    navigate(`/${detailsUrlPrefix}/${item.id}`, { state: { editMode: !!item.isEditable } });
  };

  return (
    <Container className="my-4 flex-grow-1">
      {/* Top Toolbar */}
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
                  <tr key={item.id} onClick={() => handleOpen(item)} style={{ cursor: "pointer" }} className="table-row-clickable">
                    {columns.map((col, index) => (
                      <td key={index} className="align-middle text-nowrap">
                        {col.isDate ? formatDateTime(item[col.field]) : item[col.field]}
                      </td>
                    ))}
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
    </Container>
  );
};

export default GenericTable;
