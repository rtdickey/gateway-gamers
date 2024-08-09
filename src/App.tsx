import Button from "./components/Button/Button";

export const App = () => {
  return (
    <Button variant="primary" onClick={() => alert("Button Clicked!")}>
      Test Button
    </Button>
  );
};

export default App;
