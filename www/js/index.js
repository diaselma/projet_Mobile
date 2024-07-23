$(document).ready(function () {
    // Initialiser la liste de contacts
    let contacts = [];

    // Charger les contacts existants
    loadContacts();

    // Soumettre le formulaire pour ajouter un nouveau contact
    $('#addContactForm').submit(function (event) {
        event.preventDefault(); // Empêcher le rechargement de la page

        // Récupérer les valeurs du formulaire
        const name = $('#name').val();
        const phone = $('#phone').val();
        const email = $('#email').val();

        // Valider les données du formulaire
        if (!name || !phone || !email) {
            alert('Veuillez remplir tous les champs.');
            return;
        }

        // Créer un nouvel objet de contact
        const newContact = {
            name: name,
            phone: phone,
            email: email
        };

        // Ajouter le contact à la liste
        contacts.push(newContact);

        // Sauvegarder et afficher la liste des contacts
        saveContacts();
        showContacts();

        // Réinitialiser le formulaire et revenir à la page d'accueil
        $('#addContactForm')[0].reset();
        $.mobile.changePage('#home');
    });

    // Ajouter un contact depuis le téléphone
    $('#addFromDevice').click(function () {
        navigator.contacts.pickContact(function (contact) {
            const name = contact.name.formatted || 'Nom inconnu';
            const phone = contact.phoneNumbers ? contact.phoneNumbers[0].value : 'Numéro inconnu';
            const email = contact.emails ? contact.emails[0].value : 'Email inconnu';

            // Créer un nouvel objet de contact
            const newContact = {
                name: name,
                phone: phone,
                email: email
            };

            // Ajouter le contact à la liste
            contacts.push(newContact);

            // Sauvegarder et afficher la liste des contacts
            saveContacts();
            showContacts();
        }, function (error) {
            alert('Erreur lors de la récupération du contact : ' + error);
        });
    });

    // Afficher les contacts existants
    function showContacts() {
        const contactList = $('#contactList');
        contactList.empty(); // Vider la liste avant de la remplir

        contacts.forEach(function (contact, index) {
            contactList.append(`
                <li>
                    <a href="#contactDetailsPage" class="contact-link" data-index="${index}">
                        <h2>${contact.name}</h2>
                        <p>Téléphone: ${contact.phone}</p>
                        <p>Email: ${contact.email}</p>
                    </a>
                </li>
            `);
        });

        contactList.listview('refresh');
    }

    // Sauvegarder les contacts dans le stockage local
    function saveContacts() {
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }

    // Charger les contacts du stockage local
    function loadContacts() {
        const storedContacts = localStorage.getItem('contacts');
        if (storedContacts) {
            contacts = JSON.parse(storedContacts);
        }
        showContacts();
    }

    // Événement de clic sur un lien de contact
    $(document).on('click', '.contact-link', function () {
        const index = $(this).data('index');
        const contact = contacts[index];

        // Afficher les détails du contact sélectionné
        $('#contactName').text(contact.name);
        $('#contactPhone').text(contact.phone);
        $('#contactEmail').text(contact.email);
    });
});
