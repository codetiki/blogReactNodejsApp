import React from 'react';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'react-bootstrap';
import "../components/Navbar.css"

// luetaan käyttäjän tekemät hakuvalintat, josta luodaan query-statemuuttujaan merkkijono
const doSearchQuery = (ammatti) => {
    let r = [];
    if (ammatti !== '') r.push(ammatti);

    return r
}

const Post = () => {

    const [tyypit, setTyypit] = useState([]);
    const [tarpeet, setTarpeet] = useState([]);
    const [tarveId, setTarveId] = useState('');
    const [postiId, setPostiId] = useState('');
    const [query, setQuery] = useState('');
    const [vapaaTarve, setVapaaTarve] = useState(true);
    // Blog-taulukko
    const [postit, setPostit] = useState([]);
    const [posti, setPosti] = useState([]);
    const [showTaulukko, setShowTaulukko] = useState(false);
    const [showRivi, setShowRivi] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showNewForm, setShowNewForm] = useState(false);
    const [showHakuForm, setShowHakuForm] = useState(true);
    const [muutettavaId, setMuutettavaId] = useState('');
    const [valittuId, setValittuId] = useState('');
    // pyyntö DELETE fetch-kutsuun
    const [postToBeDeleted, setPostToBeDeleted] = useState(null);
    const [modifiedPost, setModifiedPost] = useState(null);
    const [postMuutettu, setPostMuutettu] = useState(null);
    const [newPost, setNewPost] = useState(null);
    // näytettävän asiakastaulukon otsikot
    const otsikko = { postId: "postId", title: "title", content: "content", category: "category", verified: "verified", blogId: "blogId" }

    // blogien haku
    useEffect(() => {
        const fetchAsiakastyyppi = async () => {
            const r = await fetch('http://localhost:3002/api/blog');
            // HUOM! Vasta seuraavan rivin jälkeen asiakastyypit (jotka palautuvat body-lohkossa) ovat käytettävissä
            // muuttujassa data
            const data = await r.json();
            setTyypit([{ blogId: -1, url: "Valitse" }, ...data.data]);
            console.log(data.data);
        }
        fetchAsiakastyyppi();
    }, [])

    // Tarpeiden haku
    useEffect(() => {
        const fetchTarve = async () => {
            const r = await fetch('http://localhost:3002/api/vapaatarve');
            // HUOM! Vasta seuraavan rivin jälkeen asiakastyypit (jotka palautuvat body-lohkossa) ovat käytettävissä
            // muuttujassa data
            const data = await r.json();
            setTarpeet([{ tarveId: -1, asia: "Valitse" }, ...data.data]);
            console.log(data.data);
            console.log(data.data.tarpeet);
            setVapaaTarve(false);
        }
        if (vapaaTarve) {
            fetchTarve();
        }

    }, [vapaaTarve])

    // postien haku
    useEffect(() => {
        const fetchPostit = async () => {
            const response = await fetch('http://localhost:3002/api/post?' + query);
            const data = await response.json();
            setPostit(data.data);
        }
        if (query !== '') {
            fetchPostit();
        }
    }, [query])

    // 2.2. Haetaan muutettavan nimikkeen tiedot tietokannasta (Nimike / GET)
    useEffect(() => {
        const fetchPostById = async () => {
            const r = await fetch('http://localhost:3002/api/post/' + muutettavaId);
            const data = await r.json();
            // Huomaa että tämä palvelu palauttaa VAIN yhden object:n
            // jos haet niin että url on muotoa http://localhost:3004/asiakas?id=200 -> palautuu TAULUKKO -> ota taulukon 1. alkio

            setPostMuutettu(data.data);

            // setshowEditForm(true);
        }
        if (muutettavaId > 0) {
            fetchPostById();
        }

    }, [muutettavaId])

    // Haetaan valittu posti listaan
    useEffect(() => {
        const fetchPostById = async () => {
            console.log("valittuId: " + valittuId);
            const r = await fetch('http://localhost:3002/api/post/' + valittuId);
            const data = await r.json();
            setPosti(data.data);
            console.log("data.data: " + data.data);
        }
        if (valittuId > 0) {
            fetchPostById();
        }
    }, [valittuId])

    // Lisääminen POST
    useEffect(() => {
        // Body-lohkoon, raw/JSON-muotoista dataa, kaikki data mitä halutaan lisätä/muuttaa
        // Generoi automaattisesti seuraavan vapaan id-numeron. Miten se sen tekee?
        // tämä vain lisää kyseisen rivin
        const postPersons = async () => {
            let myData = { title: newPost.title, content: newPost.content, category: newPost.category, verified: newPost.verified, blogId: newPost.blogId };
            console.log("Merkkijono: ", JSON.stringify(myData));
            // URL osoite on sama kuin luetaan READ dataa
            let response = await fetch("http://localhost:3002/api/post", {
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
            setNewPost(null);
            setQuery(doSearchQuery("ok"));

            setShowTaulukko(true);
            setShowEditForm(false);
        }
        if (newPost) {
            postPersons();
        }

    }, [newPost]);

    // Kiinnityksen Lisääminen POST
    useEffect(() => {
        // Body-lohkoon, raw/JSON-muotoista dataa, kaikki data mitä halutaan lisätä/muuttaa
        // Generoi automaattisesti seuraavan vapaan id-numeron. Miten se sen tekee?
        // tämä vain lisää kyseisen rivin
        const postKiinnitys = async () => {
            let myData = { tarveId_Id: tarveId, postId_Id: postiId };
            console.log("Merkkijono: ", JSON.stringify(myData));
            // URL osoite on sama kuin luetaan READ dataa
            let response = await fetch("http://localhost:3002/api/kiinnitys", {
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

        }
        if (postiId) {
            postKiinnitys();
        }

    }, [postiId]);


    // Valitun nimikkeen muokkaus (Nimike / PUT)
    useEffect(() => {
        // Body-lohkoon, raw/JSON-muotoista dataa, kaikki data mitä halutaan lisätä/muuttaa
        // Generoi automaattisesti seuraavan vapaan id-numeron. Miten se sen tekee?
        // tämä vain lisää kyseisen rivin
        const putPost = async () => {
            let myData = { title: modifiedPost.title, content: modifiedPost.content, category: modifiedPost.category, verified: modifiedPost.verified, blogId: modifiedPost.blogId };
            console.log("Merkkijono: ", JSON.stringify(myData));
            // URL osoite on sama kuin luetaan READ dataa
            let response = await fetch("http://localhost:3002/api/post/" + modifiedPost.postId, {
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
            setModifiedPost(null);
            setQuery(doSearchQuery("ok"));
            setShowTaulukko(true);
            setShowEditForm(false);
        }
        if (modifiedPost != null) {
            putPost();
        }

    }, [modifiedPost]);
    //------------------------------

    // Modal-ponnahdusikkunaan ilmoitus, jos deletointi ei voi suorittaa
    // Valitun tehtävän poistaminen (Tehtävä / DELETE)
    useEffect(() => {
        const deletePost = async () => {
            console.log("blogId" + postToBeDeleted);
            const r = await fetch('http://localhost:3002/api/post/' + postToBeDeleted, {
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
        if (postToBeDeleted != null) {
            deletePost();
        }
    }, [postToBeDeleted])

    const handleFetch = () => {
        console.log("Hae");
        let m = "ok";
        setQuery(m);
        setShowTaulukko(true);
    }

    const onDeletePost = (postId) => {
        let d = "";
        if (postId !== "") {
            d = postId;
            console.log("postId" + postId);
            setPostToBeDeleted(postId);
        }
    }

    // Nimikkeen muokkaus
    const onEditPost = (post) => {
        setMuutettavaId(post.postId);
        setShowTaulukko(false);
        setShowEditForm(true);
        setShowNewForm(false);
    }

    // Nimikkeen kiinnitys
    const onTarvePost = (postId) => {
        setValittuId(postId);
        setShowRivi(true);
        setVapaaTarve(true);
    }

    const onKiinnitysPost = (postId) => {
        console.log(postId + ", " + tarveId);
        setPostiId(postId);
        setShowRivi(false);

        alert('Hienoa!, Kiinnitys onnistui!');
    }

    const onNew = () => {
        setShowTaulukko(false);
        setShowEditForm(false);
        setShowNewForm(true);
    }

    // Tallennetaan Blogin muokkaus
    const onSavePost = (muokattu) => {
        if (muokattu.postId > 0) {
            setModifiedPost(muokattu);
            console.log("muokattu: ", muokattu);
        }
        else {
            setNewPost(muokattu);
        }
    }
    // Poistutaan Blogin muokkaus-tilasta
    const onCancel = () => {
        setShowHakuForm(true);
        setShowTaulukko(true);
        setShowEditForm(false);
    }

    const asiakastyypit = tyypit.map(t => <option value={t.blogId} key={t.blogId}>{t.url}</option>)

    const asiakastarpeet = tarpeet.map(t => <option value={t.tarveId} key={t.tarveId}>{t.asia}</option>)

    return (
        <div class="outer_table">
            <h1>Postit</h1>
            {
                showEditForm ? <PostEditForm tyypit={asiakastyypit} onSavePost={onSavePost} onCancel={onCancel} muokattavaPost={postMuutettu} /> : null
            }
            {
                showNewForm ? <PostNewForm tyypit={asiakastyypit} onSavePost={onSavePost} onCancel={onCancel} muokattavaPost={postMuutettu} /> : null
            }
            {
                showTaulukko ?
                    <div>
                        <h3>Kaikki postit</h3>
                        <Table striped bordered hover style={{ textAlign: "center" }}>
                            <thead>
                                <tr>
                                    <th>{otsikko.postId}</th>
                                    <th>{otsikko.title}</th>
                                    <th>{otsikko.content}</th>
                                    <th>{otsikko.category}</th>
                                    <th>{otsikko.verified}</th>
                                    <th>{otsikko.blogId}</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                    <th>Kiinnitys</th>
                                </tr>
                            </thead>
                            <tbody>
                                {postit.map((m, postId) => {
                                    return (
                                        <tr key={m.postId}>
                                            <td>{m.postId}</td>
                                            <td>{m.title}</td>
                                            <td>{m.content}</td>
                                            <td>{m.category}</td>
                                            <td>{m.verified}</td>
                                            <td>{m.blogId}</td>
                                            <td><button type="text" class="btn btn-warning" onClick={() => onEditPost(m)}>Muokkaus {m.postId}</button></td>
                                            <td><button type="text" class="btn btn-danger" onClick={() => onDeletePost(m.postId)}>Poista {m.postId}</button></td>
                                            <td><button type="text" class="btn btn-primary" onClick={() => onTarvePost(m.postId)}>Kiinnitys Tarpeeseen {m.postId}</button></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </div>
                    : null
            }
            {
                showRivi ?
                    <div>
                        <h3>Valitun postin kiinnittäminen tarpeeseen</h3>
                        <Table striped bordered hover style={{ textAlign: "center" }}>
                            <thead>
                                <tr>
                                    <th>{otsikko.postId}</th>
                                    <th>{otsikko.title}</th>
                                    <th>{otsikko.content}</th>
                                    <th>{otsikko.category}</th>
                                    <th>{otsikko.verified}</th>
                                    <th>{otsikko.blogId}</th>
                                    <th>Tarve</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{posti.postId}</td>
                                    <td>{posti.title}</td>
                                    <td>{posti.content}</td>
                                    <td>{posti.category}</td>
                                    <td>{posti.verified}</td>
                                    <td>{posti.blogId}</td>
                                    <td> <select value={tarveId} onChange={e => setTarveId(e.target.value)}>
                                        {asiakastarpeet}
                                    </select></td>
                                    <td><button type="text" class="btn btn-secondary" onClick={() => onKiinnitysPost(posti.postId)}>Kiinnitä</button></td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                    : null
            }

            <button type="button" class="btn btn-primary" onClick={() => handleFetch()}>Hae dataa</button>
            <button type="button" class="btn btn-success" onClick={() => onNew()}>Uusi post</button>

        </div>
    );
}

const PostEditForm = (props) => {

    const { tyypit, onSavePost, onCancel, muokattavaPost } = props;

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [verified, setVerified] = useState('');
    const [blogId, setBlogId] = useState('');

    // Päivitetään muutettavat tiedot input-kenttiin
    useEffect(() => {
        if (muokattavaPost) {
            // haetaan nimike_id:llä. Tämä lisätään taulukkoon
            setTitle(muokattavaPost.title);
            setContent(muokattavaPost.content);
            setCategory(muokattavaPost.category);
            setVerified(muokattavaPost.verified);
            setBlogId(muokattavaPost.blogId);

        }
    }, [muokattavaPost])


    const onEditoituPost = () => {
        onSavePost({ postId: muokattavaPost.postId, title: title, content: content, category: category, verified: verified, blogId: blogId })
    }

    return (
        <div>
            <h2>Muokkaa Postia (Syötä aika yyyy-MM-dd hh:m:sec -muodossa)</h2>
            <form>

                <label>
                    Title:
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </label>
                <label>
                    Content:
                    <input type="text" value={content} onChange={(e) => setContent(e.target.value)} />
                </label>
                <label>
                    Category:
                    <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
                </label>
                <label>
                    Verified:
                    <input type="text" value={verified} onChange={(e) => setVerified(e.target.value)} />
                </label>
                <label>
                    BlogId:
                    <select value={blogId} onChange={e => setBlogId(e.target.value)}>
                        {tyypit}
                    </select>
                </label>
            </form>

            <button type="button" class="btn btn-warning" onClick={() => onEditoituPost()}>Muokkaa</button>
            <button type="button" class="btn btn-primary" onClick={() => onCancel()}>Peruuta</button>

            <p></p>
        </div>
    )
}

const PostNewForm = (props) => {

    const { tyypit, onSavePost, onCancel, muokattavaPost } = props;

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [verified, setVerified] = useState('');
    const [blogId, setBlogId] = useState('');

    // Päivitetään muutettavat tiedot input-kenttiin
    useEffect(() => {
        if (muokattavaPost) {
            // haetaan nimike_id:llä. Tämä lisätään taulukkoon
            setTitle("");
            setContent("");
            setCategory("");
            setVerified("");
            setBlogId(-1);
        }
    }, [muokattavaPost])


    const onNewPost = () => {
        onSavePost({ postId: -1, title: title, content: content, category: category, verified: verified, blogId: blogId })
        console.log("blogId: " + blogId);
    }

    return (
        <div>
            <h2>Uusi Posti (Syötä aika yyyy-MM-dd hh:m:sec -muodossa)</h2>
            <form>

                <label>
                    Title:
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </label>
                <label>
                    Content:
                    <input type="text" value={content} onChange={(e) => setContent(e.target.value)} />
                </label>
                <label>
                    Category:
                    <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
                </label>
                <label>
                    Verified:
                    <input type="text" value={verified} onChange={(e) => setVerified(e.target.value)} />
                </label>
                <label>
                    BlogId:
                    <select value={blogId} onChange={e => setBlogId(e.target.value)}>
                        {tyypit}
                    </select>
                </label>
            </form>

            <button type="button" class="btn btn-success" onClick={() => onNewPost()}>Lisää</button>
            <button type="button" class="btn btn-primary" onClick={() => onCancel()}>Peruuta</button>

            <p></p>
        </div>
    )
}

export default Post;
