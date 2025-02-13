async function fetchCourses() {
  try {
    const response = await fetch('http://localhost:5000/api/courses');
    const courses = await response.json();
    const courseListDiv = document.getElementById('course-list');
    
    courses.forEach(course => {
      courseListDiv.innerHTML += `
        <div class="card shadow">
          <div class="card-header border-primary">
            <div class="row">
              <div class="col-6">
                <a href="#" class="course-name h5">${course.coursename}</a>
              </div>
              <div class="col-6 text-end">
                <p>${course.fees}</p>
              </div>
            </div>
          </div>
          <div class="card-body border-transparent">
            <div class="row">
              <div class="col-6">
                <p>${course.courseduration}</p>
              </div>
              <div class="col-6 text-end">
                <a href="#" class="course-list-link">${course.feeslink}</a>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-6 col-md-4">
                <p>${course.eligibility}</p>
              </div>
              <div class="col-lg-6 col-md-8 text-md-end">
                <a href="${course.brochurelink}" class="btn btn-primary" download="Brochure">${course.brochurename}</a>
                <a href="${course.applylink}" class="btn btn-primary">${course.applyname}</a>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <p>
              <a class="" data-bs-toggle="collapse" href="#collapse${course.coursename.replace(/\s+/g, '')}" role="button" aria-expanded="false" aria-controls="collapse${course.coursename.replace(/\s+/g, '')}">View Details</a>
            </p>
            <div class="collapse" id="collapse${course.coursename.replace(/\s+/g, '')}">
              <div class="table-responsive">
                <table class="table table-bordered rounded">
                  <thead class="table-dark text-light">
                    <tr>
                      <th scope="col">Course</th>
                      <th scope="col">Fees</th>
                      <th scope="col">Eligibility</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${course.table.map(row => `
                      <tr class="align-middle">
                        <td class="py-3">${row.program}</td>
                        <td class="py-3">${row.fees}</td>
                        <td class="py-3">${row.eligibility}</td>
                      </tr>`).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>`;
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
  }
}

fetchCourses();

  document.addEventListener('DOMContentLoaded', loadCourses);

  async function getCourseSeats(){
    try {
        
     const fetchCourseSeats = await fetch("http://localhost/phpprog/courseSeats.json")
     if(!fetchCourseSeats){
         throw new Error("fetch data have failled");
     }
     var fetchCourseSeatsData = await fetchCourseSeats.json();
     const courseSeatsTable = document.getElementsByClassName("tableData")[0];
     var courseSeatsStructure = ``;
     fetchCourseSeatsData.forEach((listData) =>{
     
         courseSeatsStructure = `
          <tr class="trow">
           <td class="tvalue">${listData.coursename}</td>
           <td class="tvalue">${listData.seats}</td>
         </tr>
     `;
     courseSeatsTable.innerHTML += courseSeatsStructure;
     });
    } catch (error) {
        console.error(error);
    }
 }
 getCourseSeats();