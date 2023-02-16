﻿using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace CloudRestaurant.Models.Repositories
{
    public class RequestRepository : ICloudRestaurantRepository<Request>
    {
        ApplicationDbContext db = new ApplicationDbContext();
        public void Add(Request request)
        {
            db.Requests.Add(request);
            db.SaveChanges();
        }

        public void Delete(int Id)
        {
            var request = Find(Id);
            db.Requests.Remove(request);
        }

        public Request Find(int? Id)
        {
           var request= db.Requests.FirstOrDefault(x => x.Id == Id);
            return request;
        }

        public IList<Request> List()
        {
            var request = db.Requests.ToList();
            return request;
        }

        public void Update(Request request)
        {
            db.Entry(request).State = EntityState.Modified;
            db.SaveChanges();
        }
    }
}