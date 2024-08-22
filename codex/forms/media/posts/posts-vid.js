function displayPost(input) {
    const postBox = document.getElementById('postBox');
    const swiperWrapper = document.getElementById('swiperWrapper');
    const swiperContainer = document.getElementById('mediaSwiper');

    const files = input.files;
    const maxFiles = 15; // Increased from 10 to 15
    const existingSlides = swiperWrapper.children.length;
    const displayFiles = Array.from(files).slice(0, maxFiles - existingSlides);

    if (displayFiles.length > 0) {
        postBox.classList.add('filled');
        swiperContainer.style.display = 'block';

        displayFiles.forEach((file, index) => {
            const slide = document.createElement('div');
            slide.classList.add('swiper-slide');

            const mediaWrapper = document.createElement('div');
            mediaWrapper.classList.add('media-wrapper');
            mediaWrapper.style.position = 'relative';

            const closeIcon = document.createElement('i');
            closeIcon.classList.add('fa-solid', 'fa-x', 'post-close-icon');
            closeIcon.style.display = 'block';
            closeIcon.onclick = function() {
                swiperWrapper.removeChild(slide);
                if (swiperWrapper.children.length === 0) {
                    swiperContainer.style.display = 'none';
                    postBox.classList.remove('filled');
                } else {
                    swiperContainer.swiper.update();
                }
            };

            if (file.type.startsWith('image/')) {
                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                img.style.maxWidth = '100%';
                img.style.maxHeight = '100%';
                img.style.objectFit = 'contain';
                mediaWrapper.appendChild(img);
            } else if (file.type.startsWith('video/')) {
                const video = document.createElement('video');
                video.src = URL.createObjectURL(file);
                video.controls = true;
                video.style.maxWidth = '100%';
                video.style.maxHeight = '100%';
                video.style.objectFit = 'contain';
                mediaWrapper.appendChild(video);
            }

            mediaWrapper.appendChild(closeIcon);
            slide.appendChild(mediaWrapper);
            swiperWrapper.appendChild(slide);
        });

        if (swiperContainer.swiper) {
            swiperContainer.swiper.update();
        } else {
            new Swiper('.swiper-container', {
                loop: false,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                    dynamicBullets: true, // Add this option to show dynamic dots
                    dynamicMainBullets: 3, // Adjust this number to show more or fewer dots
                },
                touchRatio: 1,
                simulateTouch: true,
                grabCursor: true,
                threshold: 0,
                longSwipesRatio: 0.1,
                longSwipesMs: 50,
                followFinger: true,
                resistanceRatio: 0.85,
                shortSwipes: true,
                allowTouchMove: true,
            });
        }
    }
}

function adjustPostboxHeight(media) {
    const postBox = document.getElementById('postBox');
    const aspectRatio = media.videoWidth / media.videoHeight || media.naturalWidth / media.naturalHeight;

    if (aspectRatio > 1) {
        postBox.style.paddingTop = (100 / aspectRatio) + '%';
    } else {
        postBox.style.paddingTop = (aspectRatio * 100) + '%';
    }
}

document.querySelectorAll('.swiper-slide img, .swiper-slide video').forEach(media => {
    media.onload = () => adjustPostboxHeight(media);
    media.onloadedmetadata = () => adjustPostboxHeight(media);
});


let musicFileName = ""; // Variable to store the actual music file name

function displayMusic(input) {
    const musicBox = document.getElementById('musicBox');
    musicBox.innerHTML = ''; // Clear previous music selection

    const files = input.files;
    if (files.length > 0) {
        // Capture the actual music file name
        const file = files[0];
        musicFileName = file.name; // Get the full file name including extension
        console.log("Music File Name Captured:", musicFileName); // Debug: check the file name

        // Create a container for the file name and audio element
        const fileContainer = document.createElement('div');
        fileContainer.style.display = 'flex';
        fileContainer.style.flexDirection = 'column';
        fileContainer.style.alignItems = 'center';
        fileContainer.style.position = 'relative';
        fileContainer.style.width = '100%';

        // Create a span to hold the file name with scrolling effect
        const fileNameSpan = document.createElement('span');
        fileNameSpan.textContent = musicFileName;
        fileNameSpan.style.display = 'block';
        fileNameSpan.style.width = '100%';
        fileNameSpan.style.overflow = 'hidden';
        fileNameSpan.style.whiteSpace = 'nowrap';
        fileNameSpan.style.textOverflow = 'ellipsis';
        fileNameSpan.style.textAlign = 'center';
        fileNameSpan.style.marginBottom = '10px'; // Add space between the file name and audio player
        fileNameSpan.style.padding = '0 10px'; // Add some padding for better appearance

        // Create an audio element for the uploaded file
        const audioElement = document.createElement('audio');
        audioElement.src = URL.createObjectURL(file);
        audioElement.controls = true;
        audioElement.style.width = '100%';

        // Add the file name span and audio element to the fileContainer
        fileContainer.appendChild(fileNameSpan);
        fileContainer.appendChild(audioElement);

        // Add the fileContainer to the musicBox
        musicBox.appendChild(fileContainer);

        // Create a close icon specifically for the music
        const closeMusicIcon = document.createElement('i');
        closeMusicIcon.classList.add('fa-solid', 'fa-x', 'close-music-icon');
        closeMusicIcon.style.cursor = 'pointer';
        closeMusicIcon.style.position = 'absolute';
        closeMusicIcon.style.top = '10px';
        closeMusicIcon.style.right = '10px';
        closeMusicIcon.onclick = function() {
            // Clear only the audio element when the close icon is clicked
            musicBox.innerHTML = ''; // Clears the audio element

            // Re-add the "Choose Music" button
            const chooseMusicButton = document.createElement('div');
            chooseMusicButton.classList.add('choose-music-button');
            chooseMusicButton.onclick = function() {
                input.click(); // Use the original input reference
            };
            chooseMusicButton.innerHTML = '<i class="fa-solid fa-music"></i><span class="blue-text-post">Choose Music</span>';
            musicBox.appendChild(chooseMusicButton);

            // Reset the input field to allow the same file to be chosen again
            input.value = ''; // Reset the file input value

            musicFileName = ''; // Clear the stored music file name
        };

        // Add the close music icon to the musicBox
        musicBox.appendChild(closeMusicIcon);

        // Mark the musicBox as filled
        musicBox.classList.add('filled');
    }
}





function handleMusicDrop(e) {
    preventDefaults(e);
    const dt = e.dataTransfer;
    const files = dt.files;
    displayMusic({ files });
}

function handlePostDrop(e) {
    preventDefaults(e);
    const dt = e.dataTransfer;
    const files = dt.files;
    displayPost({ files });
}

const postBox = document.getElementById('postBox');
const musicBox = document.getElementById('musicBox');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    postBox.addEventListener(eventName, preventDefaults, false);
    musicBox.addEventListener(eventName, preventDefaults, false);
});

['dragenter', 'dragover'].forEach(eventName => {
    postBox.addEventListener(eventName, () => highlight(postBox), false);
    musicBox.addEventListener(eventName, () => highlight(musicBox), false);
});

['dragleave', 'drop'].forEach(eventName => {
    postBox.addEventListener(eventName, () => unhighlight(postBox), false);
    musicBox.addEventListener(eventName, () => unhighlight(musicBox), false);
});

postBox.addEventListener('drop', handlePostDrop, false);
musicBox.addEventListener('drop', handleMusicDrop, false);

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight(box) {
    box.classList.add('highlight');
}

function unhighlight(box) {
    box.classList.remove('highlight');
}
















function previewPost() {
    const postBox = document.getElementById('postBox');
    const previewWrapper = document.querySelector('.post-preview-swiper-wrapper');
    const previewPagination = document.querySelector('.post-preview-swiper-pagination');
    const musicBox = document.getElementById('musicBox');

    // Clear previous previews
    previewWrapper.innerHTML = '';
    previewPagination.innerHTML = '';

    // Collect images and videos from postBox
    const mediaElements = postBox.querySelectorAll('.media-wrapper img, .media-wrapper video');
    const originalMusicFile = musicBox.querySelector('audio'); // Get the original music file
    const mediaArray = Array.from(mediaElements);
    let currentIndex = 0;

    // Check if there is a music file selected
    const musicSelected = !!originalMusicFile;

    // If music is selected, clone the original music file to create a separate audio element
    let clonedMusicFile;
    let isPlaying = false;
    if (musicSelected) {
        clonedMusicFile = originalMusicFile.cloneNode(true);
    }

    // Function to display the current media
    function displayCurrentMedia() {
        previewWrapper.innerHTML = '';
        const media = mediaArray[currentIndex].cloneNode(true);

        // Ensure the media fits within the container
        media.style.width = '100%';
        media.style.height = '100%';
        media.style.objectFit = 'contain';  // Ensures the media is fully visible within the container

        // Container for the image and scrolling text (if music is selected)
        const mediaContainer = document.createElement('div');
        mediaContainer.style.position = 'relative';
        mediaContainer.style.display = 'flex';
        mediaContainer.style.justifyContent = 'center';
        mediaContainer.style.alignItems = 'center';
        mediaContainer.style.width = '100%';
        mediaContainer.style.height = '100%';

        if (media.tagName.toLowerCase() === 'img' && musicSelected) {
            // Create the music icon
            const musicIcon = document.createElement('i');
            musicIcon.classList.add('fa-solid', 'fa-music', 'music-icon');
            musicIcon.style.position = 'absolute';
            musicIcon.style.bottom = '10px';
            musicIcon.style.left = '10px';
            musicIcon.style.fontSize = '24px';
            musicIcon.style.cursor = 'pointer';
            musicIcon.style.color = '#ccc';  // Ensure the music icon color is always #ccc

            // Function to toggle music play/pause
            function toggleMusic() {
                if (isPlaying) {
                    clonedMusicFile.pause();
                    isPlaying = false;
                } else {
                    clonedMusicFile.play();
                    isPlaying = true;
                }
            }

            // Play/Pause logic for the music when tapping the image or icon
            media.addEventListener('click', toggleMusic);
            musicIcon.addEventListener('click', toggleMusic);

            mediaContainer.appendChild(media);
            mediaContainer.appendChild(musicIcon);

            // Create the scroll text container
            const scrollTextContainer = document.createElement('div');
            scrollTextContainer.classList.add('scroll-text-container');
            scrollTextContainer.style.position = 'absolute';
            scrollTextContainer.style.bottom = '10px';
            scrollTextContainer.style.width = '100%';
            scrollTextContainer.style.whiteSpace = 'nowrap';
            scrollTextContainer.style.overflow = 'hidden';
            scrollTextContainer.style.textOverflow = 'ellipsis';

            // Add the music file name to the scroll text
            const scrollText = document.createElement('div');
            scrollText.textContent = musicFileName; // Use the stored music file name
            scrollText.style.animation = 'scrollText 10s linear infinite';
            scrollText.style.color = '#ccc';  // Ensure the scroll text color is always #ccc

            // Define the scrolling text animation
            const style = document.createElement('style');
            style.innerHTML = `
                @keyframes scrollText {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
            `;
            document.head.appendChild(style);

            scrollTextContainer.appendChild(scrollText);
            mediaContainer.appendChild(scrollTextContainer);

            previewWrapper.appendChild(mediaContainer);
        } else {
            // For videos or images without music, just append them directly and pause music if playing
            if (isPlaying) {
                clonedMusicFile.pause();
                isPlaying = false;
            }
            previewWrapper.appendChild(media);
        }

        updatePagination();
    }

    // Function to update the pagination dots
    function updatePagination() {
        previewPagination.innerHTML = '';
        const visibleDots = 5; // Number of visible dots
        const totalDots = mediaArray.length;
    
        // Determine the start and end index for visible dots
        let startIndex = Math.max(currentIndex - Math.floor(visibleDots / 2), 0);
        let endIndex = Math.min(startIndex + visibleDots, totalDots);
    
        if (endIndex - startIndex < visibleDots) {
            startIndex = Math.max(endIndex - visibleDots, 0);
        }
    
        for (let i = startIndex; i < endIndex; i++) {
            const dot = document.createElement('span');
            dot.classList.add('pagination-dot');
    
            // Apply dynamic sizing based on the dot's distance from the active dot
            const distanceFromActive = Math.abs(i - currentIndex);
            switch (distanceFromActive) {
                case 0:
                    dot.style.width = '14px';
                    dot.style.height = '14px';
                    dot.classList.add('active');
                    break;
                case 1:
                    dot.style.width = '10px';
                    dot.style.height = '10px';
                    break;
                case 2:
                    dot.style.width = '8px';
                    dot.style.height = '8px';
                    break;
                default:
                    dot.style.width = '6px';
                    dot.style.height = '6px';
                    break;
            }
    
            dot.addEventListener('click', () => {
                currentIndex = i;
                displayCurrentMedia();
            });
    
            previewPagination.appendChild(dot);
        }
    }
    
    // Swipe handling for touch and mouse events
    let startX = 0;
    let isSwiping = false;

    previewWrapper.addEventListener('touchstart', handleStart, {passive: true});
    previewWrapper.addEventListener('mousedown', handleStart);

    function handleStart(event) {
        isSwiping = true;
        startX = event.touches ? event.touches[0].clientX : event.clientX;
    }

    previewWrapper.addEventListener('touchmove', handleMove, {passive: true});
    previewWrapper.addEventListener('mousemove', handleMove);

    function handleMove(event) {
        if (!isSwiping) return;

        const currentX = event.touches ? event.touches[0].clientX : event.clientX;
        const diffX = startX - currentX;

        if (Math.abs(diffX) > 50) {
            if (diffX > 0 && currentIndex < mediaArray.length - 1) {
                currentIndex++;
            } else if (diffX < 0 && currentIndex > 0) {
                currentIndex--;
            }
            displayCurrentMedia();
            isSwiping = false;
        }
    }

    previewWrapper.addEventListener('touchend', () => { isSwiping = false; });
    previewWrapper.addEventListener('mouseup', () => { isSwiping = false; });
    previewWrapper.addEventListener('mouseleave', () => { isSwiping = false; });

    // Initial display
    if (mediaArray.length > 0) {
        displayCurrentMedia();
    }
}


// CSS for Pagination Dots
// CSS for Pagination Dots
const style = document.createElement('style');
style.textContent = `
    .pagination-dot {
        display: inline-block;
        width: 10px;  /* Default size for inactive dots */
        height: 10px;
        margin: 0 4px;
        background-color: rgba(204, 204, 204, 0.8);  /* Semi-transparent gray */
        border-radius: 50%;
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.3s ease;  /* Smooth transitions */
    }
    .pagination-dot.active {
        width: 14px;  /* Larger size for the active dot */
        height: 14px;
        background-color: blue;  /* Bright blue for the active dot */
        transform: scale(1.2);  /* Slight scaling for emphasis */
        animation: pulse 1.5s infinite;  /* Circular pulsing effect */
    }
    .pagination-dot:hover {
        background-color: blue;  /* Change color on hover */
        transform: scale(1.1);  /* Slight scaling on hover */
    }

    /* Animation for the active dot to create a pulsing effect */

`;
document.head.appendChild(style);

