import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/Navbar"
import Isi from "./pages/Isi"
import Blog from "./Blog/Blog"
import Post from "./Post/Post"
function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path='/isi' component={Isi} />
        <Route path='/blog' component={Blog} />
        <Route path='/post' component={Post} />
      </Switch>
    </Router>
  );
}

export default App;
