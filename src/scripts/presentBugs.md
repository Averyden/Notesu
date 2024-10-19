# notes.js
Currently there are these present bugs within the confines of notes.js as I see it.
* Saving is not properly functioning, it manages to retrieve the id and content, as usual. While it does save the changed note color, it for some reason does not retrieve it.
It also does not save the completion status. 
<i>Although that one is my fault cause I might have forgotten to save it in the first place</i>

# index.js (Possibly popup.js actually)
Since this is handled within <b>index.js</b> and not <b>sidebar.js</b>  
<i> I should honestly just move that part back into <b> index.js</b> rather than having it be in its own file.</i>
I figured Id mention the bug here.
* It remembers the first option chosen from the sidebar during the session, and no matter which option you pick, whatever the first one was, will be done on every confirm.
- This means that if i start a session, start by deleting a note and then attempt to set a deadline for a new note, the new note is <i>ALSO</i> deleted, despite selecting the deadline option from the sidebar.