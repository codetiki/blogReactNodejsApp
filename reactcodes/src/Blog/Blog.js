import React from 'react';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'react-bootstrap';
import "../components/Navbar.css"

// luetaan käyttäjän tekemät hakuvalintat, josta luodaan query-statemuuttujaan merkkijono
const doSearchQuery = (ammatti) => {
    let r = [];
    if (ammatti != '') r.push(ammatti);

    return r
}

const Blog = () => {

    const [query, setQuery] = useState('');
    // Blog-taulukko
    const [blogit, setBlogit] = useState([]);
    const [showTaulukko, setShowTaulukko] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showNewForm, setShowNewForm] = useState(false);
    const [showHakuForm, setShowHakuForm] = useState(true);
    const [muutettavaId, setMuutettavaId] = useState('');
    // pyyntö DELETE fetch-kutsuun
    const [blogToBeDeleted, setBlogToBeDeleted] = useState(null);
    const [modifiedBlog, setModifiedBlog] = useState(null);
    const [blogMuutettu, setBlogMuutettu] = useState(null);
    const [newBlog, setNewBlog] = useState(null);
    // näytettävän asiakastaulukon otsikot
    const otsikko = { blogId: "blogId", url: "url" }



    // blogien haku
    useEffect(() => {
        const fetchBlogit = async () => {
            const response = await fetch('http://localhost:3002/api/blog?' + query);
            const data = await response.json();
            setBlogit(data.data);
        }
        if (query != '') {
            fetchBlogit();
        }
    }, [query])

    // 2.2. Haetaan muutettavan nimikkeen tiedot tietokannasta (Nimike / GET)
    useEffect(() => {
        const fetchBlogById = async () => {
            const r = await fetch('http://localhost:3002/api/blog/' + muutettavaId);
            const data = await r.json();
            // Huomaa että tämä palvelu palauttaa VAIN yhden object:n
            // jos haet niin että url on muotoa http://localhost:3004/asiakas?id=200 -> palautuu TAULUKKO -> ota taulukon 1. alkio

            setBlogMuutettu(data.data);

            // setshowEditForm(true);
        }
        if (muutettavaId > 0) {
            fetchBlogById();
        }

    }, [muutettavaId])

    // Lisääminen POST
    useEffect(() => {
        // Body-lohkoon, raw/JSON-muotoista dataa, kaikki data mitä halutaan lisätä/muuttaa
        // Generoi automaattisesti seuraavan vapaan id-numeron. Miten se sen tekee?
        // tämä vain lisää kyseisen rivin
        const postPersons = async () => {
            let myData = { url: newBlog.url };
            console.log("Merkkijono: ", JSON.stringify(myData));
            // URL osoite on sama kuin luetaan READ dataa
            let response = await fetch("http://localhost:3002/api/blog", {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify(myData) // tarvitaan POST ja PUT metodeissa, JSON.stringify muokkaa objektitaulukosta merkkijonon
            });
            let repos = await response.json();
            setNewBlog(null);
            setQuery(doSearchQuery("ok"));
            setShowTaulukko(true);
            setShowEditForm(false);
        }
        if (newBlog) {
            postPersons();
        }

    }, [newBlog]);

    // Valitun nimikkeen muokkaus (Blog / PUT)
    useEffect(() => {
        // Body-lohkoon, raw/JSON-muotoista dataa, kaikki data mitä halutaan lisätä/muuttaa
        // Generoi automaattisesti seuraavan vapaan id-numeron. Miten se sen tekee?
        // tämä vain lisää kyseisen rivin
        const putBlog = async () => {
            let myData = { url: modifiedBlog.url };
            console.log("Merkkijono: ", JSON.stringify(myData));
            // URL osoite on sama kuin luetaan READ dataa
            let response = await fetch("http://localhost:3002/api/blog/" + modifiedBlog.blogId, {
                method: 'PUT',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify(myData) // tarvitaan POST ja PUT metodeissa, JSON.stringify muokkaa objektitaulukosta merkkijonon
            });
            let repos = await response.json();
            setModifiedBlog(null);
            setQuery(doSearchQuery("ok"));
            setShowTaulukko(true);
            setShowEditForm(false);
        }
        if (modifiedBlog != null) {
            putBlog();
        }

    }, [modifiedBlog]);
    //------------------------------

    // Modal-ponnahdusikkunaan ilmoitus, jos deletointi ei voi suorittaa
    // Valitun tehtävän poistaminen (Tehtävä / DELETE)
    useEffect(() => {
        const deleteBlog = async () => {
            console.log("blogId" + blogToBeDeleted);
            const r = await fetch('http://localhost:3002/api/blog/' + blogToBeDeleted, {
                method: 'DELETE',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify()
            });

            setQuery(doSearchQuery("ok"));
        }
        if (blogToBeDeleted != null) {
            deleteBlog();
        }
    }, [blogToBeDeleted])

    const handleFetch = () => {
        console.log("Hae");
        let m = "ok";
        setQuery(m);
        setShowTaulukko(true);
    }

    const onDeleteBlog = (blogId) => {
        let d = "";
        if (blogId !== "") {
            d = blogId;
            console.log("blogId" + blogId);
            setBlogToBeDeleted(blogId);
        }
    }

    // Nimikkeen muokkaus
    const onEditBlog = (blog) => {
        setMuutettavaId(blog.blogId);
        setShowTaulukko(false);
        setShowEditForm(true);
        setShowNewForm(false);
    }

    const onNew = () => {
        setShowTaulukko(false);
        setShowEditForm(false);
        setShowNewForm(true);
    }

    // Tallennetaan Blogin muokkaus
    const onSaveBlog = (muokattu) => {

        console.log("muokattu.blogId: ", muokattu.blogId);
        console.log("muokattu.url: ", muokattu.url);

        if (muokattu.blogId > 0) {
            setModifiedBlog(muokattu);
            console.log("muokattu: ", muokattu);
        }
        else {
            setNewBlog(muokattu);
        }
    }

    // Poistutaan Blogin muokkaus-tilasta
    const onCancel = () => {
        setShowHakuForm(true);
        setShowTaulukko(true);
        setShowEditForm(false);
        setShowNewForm(false);
    }

    return (
        <div class="outer_table">
            <h1>Blogit</h1>
            {
                showEditForm ? <BlogEditForm onSaveBlog={onSaveBlog} onCancel={onCancel} muokattavaBlog={blogMuutettu} /> : null
            }
            {
                showNewForm ? <BlogNewForm onSaveBlog={onSaveBlog} onCancel={onCancel} muokattavaBlog={blogMuutettu} /> : null
            }
            {
                showTaulukko ?
                    <div>
                        <Table striped bordered hover style={{ textAlign: "center" }}>
                            <thead>
                                <tr>
                                    <th>{otsikko.blogId}</th>
                                    <th>{otsikko.url}</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {blogit.map((m, blogId) => {
                                    return (
                                        <tr key={m.blogId}>
                                            <td>{m.blogId}</td>
                                            <td>{m.url}</td>
                                            <td><button type="text" class="btn btn-warning" onClick={() => onEditBlog(m)}>Muokkaus {m.blogId}</button></td>
                                            <td><button type="text" class="btn btn-danger" onClick={() => onDeleteBlog(m.blogId)}>Poista {m.blogId}</button></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </div>
                    : null
            }

            <button type="button" class="btn btn-primary" onClick={() => handleFetch()}>Hae dataa</button>
            <button type="button" class="btn btn-success" onClick={() => onNew()}>Uusi blog</button>

        </div>
    );
}

const BlogEditForm = (props) => {

    const { onSaveBlog, onCancel, muokattavaBlog } = props;

    const [url, setUrl] = useState('');


    // Päivitetään muutettavat tiedot input-kenttiin
    useEffect(() => {
        if (muokattavaBlog) {
            // haetaan nimike_id:llä. Tämä lisätään taulukkoon
            setUrl(muokattavaBlog.url);
        }
    }, [muokattavaBlog])


    const onEditoituBlog = () => {
        onSaveBlog({ blogId: muokattavaBlog.blogId, url: url })
    }

    return (
        <div>
            <h2>Muokkaa Blogia</h2>
            <form>

                <label>
                    Url:
                    <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
                </label>
            </form>

            <button type="button" class="btn btn-primary" onClick={() => onEditoituBlog()}>Muokkaa Blog</button>
            <button type="button" class="btn btn-primary" onClick={() => onCancel()}>Peruuta</button>

            <p></p>
        </div>
    )
}

const BlogNewForm = (props) => {

    const { onSaveBlog, onCancel, muokattavaBlog } = props;

    const [url, setUrl] = useState('');


    // Päivitetään muutettavat tiedot input-kenttiin
    useEffect(() => {
        if (muokattavaBlog) {
            // haetaan nimike_id:llä. Tämä lisätään taulukkoon
            setUrl(muokattavaBlog.url);
        }
    }, [muokattavaBlog])


    const onNewBlog = () => {
        onSaveBlog({ blogId: -1, url: url })
    }

    return (
        <div>
            <h2>Lisää Blogi</h2>
            <form>

                <label>
                    Url:
                    <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
                </label>
            </form>

            <button type="button" class="btn btn-success" onClick={() => onNewBlog()}>Lisää Blog</button>
            <button type="button" class="btn btn-primary" onClick={() => onCancel()}>Peruuta</button>

            <p></p>
        </div>
    )
}

export default Blog;
