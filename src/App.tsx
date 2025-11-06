import {  useState } from "react";
import { evaluate } from "mathjs";
function App() {
  const [value, setValue] = useState("");
  const [active, setActive] = useState<number | null>(null);
  const [history, setHistory] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem("history") || "[]");
  });

  const handleDeleteHistory = () => {
    localStorage.removeItem("history"); 
    setHistory([]); 
  };

  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "."];
  const actions = ["*", "/", "+", "-", "%"];
  const handleNumbers = (selectedValue: any) => {
    setValue((prev) => prev + selectedValue.toString());
    setActive(selectedValue);
  };

  const handleActions = (action: string) => {
    const lastChar = value.slice(-1);

    // Agar oxirgi belgi operator bo'lsa yoki value bo'sh bo'lsa, %ni qo'shmaymiz
    if (
      ["+", "-", "*", "/", "%"].includes(lastChar) ||
      (action === "%" && value === "")
    )
      return;

    setValue((prev) => prev + action);
    setActive(null);
  };

 const handleEqual = () => {
  try {
    let result;
    const hasOperator = /[+\-*/]/.test(value);

    if (value.includes("%") && !hasOperator) {
      const num = parseFloat(value.replace("%", ""));
      result = (num / 100).toString();
    } else {
      // mathjs bilan hisoblash
      const expression = value.replace(/(\d+)%/g, (_, num) => `(${num}/100)`);
      result = evaluate(expression).toString();
    }

    setValue(result);

    if (hasOperator) {
      const oldHistory = JSON.parse(localStorage.getItem("history") || "[]");
      const newHistory = [...oldHistory, `${value} = ${result}`];
      localStorage.setItem("history", JSON.stringify(newHistory));
      setHistory(newHistory);
    }

    setActive(null);
  } catch {
    setValue("Error");
  }
};

  const handleReset = () => {
    setActive(null);
    setValue("");
  };

  const handleDeleteLastElement = () => {
    setValue((prev) => prev.slice(0, -1));
  };
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        justifyContent: "center",
        height: "90vh",
        alignItems: "center",
      }}
    >
      <div
        style={{ display: "flex", justifyContent: "center", maxHeight: "90vh" }}
      >
        <div
          style={{
            border: "2px solid #333",
            borderRadius: "15px",
            padding: "20px",
            backgroundColor: "#2c2c2c", // container fon
            boxShadow: "0 5px 15px rgba(0,0,0,0.5)",
          }}
        >
          <input
            type="text"
            readOnly={value.startsWith("Error")}
            value={value}
            style={{
              width: "90%",
              padding: "15px",
              fontSize: "22px",
              textAlign: "right",
              borderRadius: "10px",
              border: "1px solid #555",
              backgroundColor: "#1a1a1a",
              color: "white",
              marginBottom: "15px",
            }}
            onChange={(e) => setValue(e.target.value)}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: "15px",
            }}
          >
            {/* Numbers */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 60px)",
                gap: "10px",
              }}
            >
              {numbers.map((item) => (
                <div
                  key={item}
                  onClick={() => handleNumbers(item)}
                  style={{
                    padding: "15px 0",
                    borderRadius: "8px",
                    textAlign: "center",
                    cursor: "pointer",
                    backgroundColor: item === active ? "#007bff" : "#444",
                    color: "white",
                    fontSize: "18px",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      item === active ? "#0056b3" : "#555")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      item === active ? "#007bff" : "#444")
                  }
                >
                  {item}
                </div>
              ))}

              {/* Clear */}
              <div
                onClick={handleReset}
                style={{
                  padding: "15px 0",
                  borderRadius: "8px",
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: "#ff3b30",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "18px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#cc2a25")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#ff3b30")
                }
              >
                DEL
              </div>

              {/* Delete Last */}
              <div
                onClick={handleDeleteLastElement}
                style={{
                  padding: "15px 0",
                  borderRadius: "8px",
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: "#ff3b30",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "18px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#cc2a25")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#ff3b30")
                }
              >
                C
              </div>

              {/* Equal */}
              <div
                onClick={handleEqual}
                style={{
                  padding: "15px 0",
                  borderRadius: "8px",
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: "#34c759",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "18px",
                  transition: "all 0.2s",
                  width: "130px",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#28a745")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#34c759")
                }
              >
                =
              </div>
            </div>

            {/* Actions */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(1, 60px)",
                gap: "10px",
              }}
            >
              {actions.map((item) => (
                <div
                  key={item}
                  onClick={() => handleActions(item)}
                  style={{
                    padding: "15px 0",
                    borderRadius: "8px",
                    textAlign: "center",
                    cursor: "pointer",
                    backgroundColor: "#ff9500",
                    color: "white",
                    fontSize: "18px",
                    fontWeight: "bold",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#cc7a00")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#ff9500")
                  }
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="history">
        <div
          style={{
            display: history.length ? "flex" : "none",
            justifyContent: "end",
            marginBottom: "5px",
          }}
        >
          <button
            style={{ backgroundColor: "red" }}
            onClick={handleDeleteHistory}
          >
            Delete history
          </button>
        </div>
        <div className="history-body">
          {history.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: "#999",
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
                height: "50vh",
              }}
            >
              No history yet
            </div>
          ) : (
            <div>
              {history.map((item: string, index: number) => (
                <div
                  key={index}
                  style={{
                    padding: "5px 10px",
                    marginBottom: "5px",
                    borderRadius: "5px",
                    fontFamily: "monospace",
                    backgroundColor: index % 2 === 0 ? "#333" : "#2a2a2a",
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
