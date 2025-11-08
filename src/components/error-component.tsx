interface ErrorComponentProps {
  error?: Error;
}

export default function ErrorComponent({ error }: ErrorComponentProps = {}) {
  return (
    <div
      style={{
        color: "#d32f2f",
        backgroundColor: "#ffebee",
        border: "1px solid #e57373",
        borderRadius: "4px",
        padding: "16px",
        fontFamily: "monospace",
        fontSize: "14px",
        margin: "8px 0",
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
        🚨 Component Compilation Error
      </div>
      {error ? (
        <div>
          <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
            {error.name}: {error.message}
          </div>
          {error.stack && (
            <details style={{ marginTop: "8px" }}>
              <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
                Stack Trace
              </summary>
              <pre
                style={{
                  marginTop: "8px",
                  padding: "8px",
                  backgroundColor: "#f5f5f5",
                  border: "1px solid #ddd",
                  borderRadius: "2px",
                  overflow: "auto",
                  fontSize: "12px",
                }}
              >
                {error.stack}
              </pre>
            </details>
          )}
        </div>
      ) : (
        <div>An unknown error occurred while rendering the component</div>
      )}
      <div style={{ marginTop: "12px", fontSize: "12px", opacity: 0.7 }}>
        💡 Check your component code or try registering missing libraries
      </div>
    </div>
  );
}
