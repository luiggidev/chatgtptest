export function handleErrorResponse(res, error) {
    const statusCode = error.response ? error.response.status : 500;
    const errorMessage = error.response ? error.response.data : "An error occurred during your request.";
  
    console.error(`Error: ${error.message}`);
    res.status(statusCode).json({ error: { message: errorMessage } });
  }
  