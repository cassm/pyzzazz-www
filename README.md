  <h1>pyzzazz-www</h1>
  <p>pyzzazz-www is a webserver designed to allow communication with and control of the pyzzazz lighting server via http.</p>
  <p>the initial plan was to accomplish state sharing with pyzzazz via python multiprocessing, but after several false starts I decided that Redis was a better option.</p>
  <p>There were several reasons for this:</p>
  <ul>
    <li>Python multiprocessing plays badly with almost all the methods of getting flask to handle websockets</li>
    <li>Flask isn't great for realtime applications</li>
    <li>Running two different python servers concurrently worked out badly, due to GIL etc, and I want them to be able to run happily on the same machine</li>
    <li>I'm learning node at the moment and learning about flask at the same time was doing me head in</li>
  </ul>
