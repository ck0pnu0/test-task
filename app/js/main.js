const itemsHolder = document.querySelector('.items');
const errorHolder = document.querySelector('.error');

const data = fetchJsonp('https://api.flickr.com/services/feeds/photos_public.gne?format=json', {
	jsonpCallbackFunction: 'jsonFlickrFeed',
})
	.then(function (response) {
		return response.json()
	}).then(function (json) {
		const items = json.items;
		let title,
				imgSrc,
				link,
				author,
				authorId,
				published,
				tags;
		items.forEach(function(item) {
			let sepTag = '';
			// Create div element with a class "item"
			let itemHtml = '';
			let newItem = document.createElement('div');
			newItem.classList.add('item');

			imgSrc = item.media.m;
			title = item.title;
			link = item.link;
			author = item.author;
			authorId = item.author_id; //https://www.flickr.com/people/75812391@N03/
			published = item.published;
			tags = item.tags;
			// Separate tags with a comma
			if (tags.length > 0) {
				let newTags = tags.split(' ');
				newTags.forEach(function(tag, index){					
					if (++index !== newTags.length  ) {
						sepTag += tag + ', ';
					} else {
						sepTag += tag;
					}
				});
			}
			// HTML markup for the item
			itemHtml += `
				<img src='${imgSrc}' alt='${title}'>
				<div class="meta">
					<h5><a href='${link}'>${title}</a></h5> 
					<span> by </span>
					<h6><a href='https://www.flickr.com/people/${authorId}/'>${author}</a></h6>
				</div>
				<div class='description'><p>Description: ${title} was published: ${published} </p></div>
				<div class='tags'><p>Tags: <em>${sepTag}</em></p></div>
			`;
			newItem.innerHTML = itemHtml;			
			itemsHolder.appendChild(newItem);
		});		
	}).catch(function (ex) {
		console.log('parsing failed', ex);		
		errorHolder.style.display = 'block';
	});