/**
 * This route manage the action with a link: list, save, update, delete
 */

const pool = require('../database');
const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/auth');  //Middlerware, protect functions


//Show form to add new link
router.get('/add', isLoggedIn, (request, response) => {
    response.render('links/add');
});

//Add new link
router.post('/add', isLoggedIn, async (request, response) => {
    const { title, url, description } = request.body;
    const newLink = {
        title,
        url,
        description,
        user_id: request.user.id
    };
    await pool.query('INSERT INTO links SET ?', [newLink]);
    request.flash('success', 'Link saved successfully');
    response.redirect('/links');
});

//Show all links
router.get('/', async(request, response) => {
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [request.user.id]);
    response.render('links/list', { links: links });
});

//Show one link
router.get('/:id', async(request, response) => {
    const { id } = request.params;
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    response.render('links/list', { links: links });
});

//Edit one link by POST
router.post('/edit/:id', isLoggedIn, async(request, response) => {
    const { title, url, description } = request.body;
    const { id } = request.params;
    const newLink = {
        title,
        url,
        description
    };

    await pool.query('UPDATE links SET ? WHERE id = ?', [newLink, id]);
    request.flash('success', 'Link updated successfully');
    response.redirect('/links');
});

//Edit an User by GET: used form render to form
router.get('/edit/:id', isLoggedIn, async(request, response) => {
    const { title, url, description } = request.body;
    const { id } = request.params;
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]); 
    response.render('links/edit', { link: links[0] });
});

//Delete one link
router.get('/delete/:id', isLoggedIn, async(request, response) => {
    const { id } = request.params;
    await pool.query('DELETE FROM links WHERE id = ?', [id]); 
    request.flash('success', 'Link removed successfully');
    response.redirect('/links');
});

module.exports = router